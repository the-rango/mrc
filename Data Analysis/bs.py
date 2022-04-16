# Checks for Backwards Success with unsuccessful submissions
import json
import pprint

with open("..\src\majors.json") as json_file:
    majorsdata = json.load(json_file)

# pprint.pprint(majorsdata)

cs = []
with open("clickstream.csv") as inp:
    for line in inp:
        cs.append(line.split(","))

# pprint.pprint(cs)

sample = ['7z617ujccv80zxcs6buo',
  '1622790498.5427494',
  'submit',
  '',
  '',
  '',
  '',
  '0',
  'LIFE3-850',
  'CHEM12B-690',
  'LIFE27L-798;PHYS3B-3638',
  'EEB113A-9520;MATH6A-4702',
  'MATH6C-1364;EEB132-3337',
  'MBIO112-4641;PHYS111-471',
  'CHEM120-2736;MBIO118-3899',
  'EEB129-9615;MATH6D-7928',
  'MBIO121-5867;EEB130-8237',
  'ANTH110-6325;EEB146A-5838',
  'ANTH116A-6610;MOLB115-5735',
  'MOLB124-4457;ANTH116P-7866\n']

reqs = {
  4:[
    "tags[1] + min(tags[2],1) >= 8",
    "tags[3] + tags[4] + tags[17] >= 1",
    "min(tags[5],1) + tags[6] + tags[20] + tags[7] + tags[8] + min(tags[9] + tags[3] + tags[4] + tags[17] - 1,1) >= 2",
    "max(0,min(tags[6] + tags[20], min(tags[5],1) + tags[6] + tags[20] + tags[7] + tags[8] + min(tags[9] + tags[3] + tags[4] + tags[17] - 1,1) - 2)) + tags[10] + tags[11] + tags[19] + tags[18] + 2*(tags[12] == 2) + tags[13] >= 5",
    "max(0,min(tags[6] + tags[20], min(tags[5],1) + tags[6] + tags[20] + tags[7] + tags[8] + min(tags[9] + tags[3] + tags[4] + tags[17] - 1,1) - 2)) + tags[10] + tags[11] + tags[19] + tags[18] + 2*(tags[12] == 2) >= 2",
    "tags[14] + min(tags[15],1) + tags[16] + max(0,min(tags[6] + tags[20] + tags[7], min(tags[5],1) + tags[6] + tags[20] + tags[7] + tags[8] + min(tags[9] + tags[3] + tags[4] + tags[17] - 1,1) - 2)) + max(0,min(tags[6] + tags[20] + tags[11] + tags[19] + tags[18], max(0,min(tags[6] + tags[20], min(tags[5],1) + tags[6] + tags[20] + tags[7] + tags[8] + min(tags[9] + tags[3] + tags[4] - 1,1) - 2)) + tags[10] + tags[11] + tags[19] + tags[18] + 2*(tags[12] == 2) + tags[13] - 5)) >= 8"
  ],
  3:[
    "tags[1] + min(tags[2],1) >= 8",
    "tags[3] + tags[17] >= 1",
    "min(tags[5],1) + tags[6] + tags[20] + tags[7] + min(tags[8],1) + tags[4] + tags[17] - (tags[3] == 0) >= 2",
    "max(0,min(tags[6] + tags[20], min(tags[5],1) + tags[6] + tags[20] + tags[7] + tags[8] + min(tags[9] + tags[3] + tags[4] + tags[17] - 1,1) - 2)) + tags[10] + tags[11] + tags[19] + tags[18] + 2*(tags[12] == 2) + tags[13] >= 5",
    "tags[14] + min(tags[15],1) + tags[16] + max(0,min(tags[6] + tags[20] + tags[7], min(tags[5],1) + tags[6] + tags[20] + tags[7] + tags[8] + min(tags[9] + tags[3] + tags[4] + tags[17] - 1,1) - 2)) + max(0,min(tags[6] + tags[20] + tags[11] + tags[19] + tags[18], max(0,min(tags[6] + tags[20], min(tags[5],1) + tags[6] + tags[20] + tags[7] + tags[8] + min(tags[9] + tags[3] + tags[4] - 1,1) - 2)) + tags[10] + tags[11] + tags[19] + tags[18] + 2*(tags[12] == 2) + tags[13] - 5)) >= 8"
  ],
  2:[
    "tags[1] + min(tags[2],1) >= 8",
    "tags[3] + tags[17] >= 1",
    "min(tags[5],1) + tags[6] + tags[7] + tags[20] + min(tags[8],1) + tags[4] + tags[17] - (tags[3] == 0) >= 2",
    "tags[10] + tags[19] + tags[11] + 2*(tags[12] == 2) + tags[13] >= 5",
    "tags[14] + min(tags[15],1) + tags[16] + tags[18] + min(tags[6] + tags[7] + tags[20], min(tags[5],1) + tags[6] + tags[7] + tags[20] + min(tags[8],1) + tags[4] + tags[17] - (tags[3] == 0) - 2) + min(tags[19], tags[10] + tags[19] + tags[11] + 2*(tags[12] == 2) + tags[13] - 5)  >= 8"
  ],
  1:[
    "tags[1] + min(tags[2],1) >= 8",
    "min(tags[5],1) + tags[6] + tags[7] + tags[20] + min(tags[8],1) + tags[4] + tags[17] >= 2",
    "tags[10] + tags[11] + tags[12] + tags[13] + tags[19] >= 5",
    "tags[14] + tags[15] + tags[16] + tags[18] + tags[7] + tags[20] + min(tags[19],tags[10] + tags[11] + tags[12] + tags[13] + tags[19] - 5)  >= 8"
  ],
  0:[
    "True",
  ]
}

def check(entry, major, diff):
    # Remove duplicates
    selection = set()
    for qtr in entry[8:21]:
        courses = qtr.split(';')
        for course in courses:
            selection.add(course[:course.find('-')])

    # Tag courses
    tags = [0] * 25
    catalogue = majorsdata["requirements"][major]["courses"]
    for course in selection:
        if course != "":
            try:
                tags[int(catalogue[course]["tag"][0])] += 1
            except:
                # print(course)
                return ["6"]


    # Check requirements
    failed = []
    for i,req in enumerate(reqs[diff]):
        if not eval(req):
            failed.append(str(i))

    # print(failed)
    return failed

major = ""
successes = []
for entry in cs:
    if entry[2] == "start":
        # print(entry[0])

        # Backup
        old_major = major

        major = entry[4]
    elif entry[2] == "submit":
        for difficulty in range(4,-1,-1):
            failed = check(entry, major, difficulty)

            if failed == ["6"]:
                failed = check(entry, old_major, difficulty)
                if failed == ["6"]:
                    print('************************************************************error')

            if len(failed) == 0:
                break

        hypo = entry[:2]
        hypo.append("submit-hypothetical")
        hypo.append("")
        hypo.append(major)
        hypo.append(str(difficulty))
        hypo.append(";".join(failed))
        hypo.append(str(len(failed)))
        successes.append(hypo)

# Write to csv
with open("hypotheticals.csv", "w") as out:
    for entry in successes:
        out.write(",".join(entry))
        out.write("\n")
