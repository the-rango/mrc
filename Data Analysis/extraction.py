import pymongo

out = "id,time,activity,progress,major,difficulty,failed,numberfailed,1f,1w,1s,2f,2w,2s,3f,3w,3s,4f,4w,4s\n"
db = pymongo.MongoClient("mongodb+srv://compreqs:jXgsgtQuxViBwLgQ@jerry.2hngt.mongodb.net/log?retryWrites=true&w=majority").get_default_database()
col = db["clickstream"]

progress = ""
major = ""
diff = ""

tests = [
    "null",
    "c3uwfird982ou0rku0l6d",
    "4eugjrhon5kivafq5azfy",
    "l1e8tvacp66a7g3dsedn8",
    "0924rdtm67dvvyszd8o4qo",
    "x5513r65qqh4um34gh0hg"
]

for entry in col.find():
    uid = entry["id"]
    if uid in tests:
        # Not actual data
        continue

    out += entry["id"]
    out += ","

    out += str(entry["time"])
    out += ","

    out += entry["activity"]
    out += ","

    if "progress" in entry:
        out += str(entry["progress"])
        progress = str(entry["progress"])
    else:
        pass
        # out += progress
    out += ","

    if "major" in entry:
        out += entry["major"]
        major = entry["major"]
    else:
        pass
        # out += major
    out += ","

    if "difficulty" in entry:
        out += str(entry["difficulty"])
        diff = str(entry["difficulty"])
    else:
        pass
        # out += diff
    out += ","

    if "failed" in entry:
        out += f"{';'.join(str(i) for i in entry['failed'])}"
    out += ","

    if "failed" in entry:
        out += f"{len(entry['failed'])}"
    out += ","

    if "selection" in entry:
        out += f"{';'.join(entry['selection']['1f']['courseIds'])}"
    out += ","

    if "selection" in entry:
        out += f"{';'.join(entry['selection']['1w']['courseIds'])}"
    out += ","

    if "selection" in entry:
        out += f"{';'.join(entry['selection']['1s']['courseIds'])}"
    out += ","

    if "selection" in entry:
        out += f"{';'.join(entry['selection']['2f']['courseIds'])}"
    out += ","

    if "selection" in entry:
        out += f"{';'.join(entry['selection']['2w']['courseIds'])}"
    out += ","

    if "selection" in entry:
        out += f"{';'.join(entry['selection']['2s']['courseIds'])}"
    out += ","

    if "selection" in entry:
        out += f"{';'.join(entry['selection']['3f']['courseIds'])}"
    out += ","

    if "selection" in entry:
        out += f"{';'.join(entry['selection']['3w']['courseIds'])}"
    out += ","

    if "selection" in entry:
        out += f"{';'.join(entry['selection']['3s']['courseIds'])}"
    out += ","

    if "selection" in entry:
        out += f"{';'.join(entry['selection']['4f']['courseIds'])}"
    out += ","

    if "selection" in entry:
        out += f"{';'.join(entry['selection']['4w']['courseIds'])}"
    out += ","

    if "selection" in entry:
        out += f"{';'.join(entry['selection']['4s']['courseIds'])}"

    out += "\n"

    print(entry["time"])

print("************************writing***************************")
with open("clickstream.csv", "w") as file:
    file.write(out)
