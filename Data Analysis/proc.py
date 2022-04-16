import pymongo
import pickle
import pprint

out = "id,time,activity,progress,major,difficulty,failed,numberfailed,1f,1w,1s,2f,2w,2s,3f,3w,3s,4f,4w,4s"
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

data = {}

class Action:
    def __init__(self, time, activ, prog=0, major="", diff=0, failed=[]):
        self.time = time
        self.activ = activ
        self.prog = prog
        self.major = major
        self.diff = diff
        self.failed = failed

    def __repr__(self):
        return f"{self.time}\t{self.activ}\t{self.prog}\t{self.major}\t{self.diff}\t[{', '.join(str(i) for i in self.failed)}]"


# Loading data into dict
for entry in col.find():
    uid = entry["id"]
    if uid in tests:
        # Not actual data
        continue

    # Create an Action object
    activity = entry["activity"]
    if activity == "start":
        act = Action(entry["time"], "start", entry["progress"], entry["major"], entry["difficulty"])
    elif activity == "resume" or activity == "idle" or activity == "restart":
        act = Action(entry["time"], activity)
    else:
        act = Action(entry["time"], activity, failed = entry["failed"])


    if uid not in data:
        # New user
        data[uid] = [act]
    else:
        # Existing user
        data[uid].append(act)

# pprint.pprint(data)

# Sorting data
sorteddata = {}
for user, log in data.items():
    sorteddata[user] = sorted(log, key=lambda x: x.time)

# pprint.pprint(sorteddata)
pickle.dump( sorteddata, open( "rawdata.p", "wb" ) )


# Fixing submit and second start out of order
for user, log in sorteddata.items():
    prevactiv = ""
    prevactindex = None
    for i, act in enumerate(log):
        if act.activ == "submit" and len(act.failed) == 0 and prevactiv == "start":
            temp = log[prevactindex].time
            log[prevactindex].time = act.time
            log[i].time = temp
        prevactindex = i
        prevactiv = act.activ

data = sorteddata
# Sorting data again
sorteddata = {}
for user, log in data.items():
    sorteddata[user] = sorted(log, key=lambda x: x.time)
pprint.pprint(sorteddata)


summary = []
for user, log in sorteddata.items():
    entry = [user]
    length = 0.0
    complete = 0
    nselect = 0
    ndel = 0
    nclear = 0
    nedit = 0
    nsubmit = 0
    nidle = 0
    restart = 0

    # 9
    for act in log:
        try:
            if act.activ == "start":
                entry.append(act.prog)
                entry.append(act.diff)
                entry.append(act.major)
                checkpoint = act.time
            elif act.activ == "idle":
                nidle += 1
                length += (act.time-checkpoint)
                checkpoint = "idle"
            elif act.activ == "resume":
                if checkpoint != "idle":
                    # Missing idle flag
                    # print(user,"missing idle flag", act.time, act.activ)
                    pass
                checkpoint = act.time
            else:
                # a change to plan
                length += (act.time-checkpoint)
                checkpoint = act.time
                if act.activ == "select":
                    nselect += 1
                elif act.activ == "delete":
                    ndel += 1
                elif act.activ == "clear":
                    nclear += 1
                elif act.activ == "edit":
                    nedit += 1
                elif act.activ == "submit" and len(act.failed) != 0:
                    nsubmit += 1
                else:
                    if act.activ == "restart":
                        restart = 1
                    elif act.activ == "submit" and len(act.failed) == 0:
                        nsubmit += 1
                        complete = 1
                    else:
                        print("********************************************Weird one", act)

                    entry.append(length)
                    entry.append(complete)
                    entry.append(nselect)
                    entry.append(ndel)
                    entry.append(nclear)
                    entry.append(nedit)
                    entry.append(nsubmit)
                    entry.append(nidle)
                    entry.append(restart)
                    if len(entry) != 13 or length < 0:
                        print("something went wrong", entry)
                    else:
                        summary.append(entry)

                    entry = [user]
                    length = 0.0
                    complete = 0
                    nselect = 0
                    ndel = 0
                    nclear = 0
                    nedit = 0
                    nsubmit = 0
                    nidle = 0
                    restart = 0


        except Exception as e:
            checkpoint = act.time
            # print(user, str(e), "missing resume flag", act.time, act.activ)



    if len(entry) != 1:
        if complete == 1:
            print("Not supposed to be a complete one")
        entry.append(length)
        entry.append(complete)
        entry.append(nselect)
        entry.append(ndel)
        entry.append(nclear)
        entry.append(nedit)
        entry.append(nsubmit)
        entry.append(nidle)
        entry.append(restart)
        if len(entry) != 13 or length<0:
            print("something went wrong", entry)
        else:
            summary.append(entry)

print("==============Writing to file================")
with open("summary.csv","w") as file:
    file.write("id,progress,difficulty,major,length,complete,nselects,ndeletes,nclears,nedits,nsubmits,nidles,restart\n")
    for entry in summary:
        file.write(",".join(str(i) for i in entry))
        file.write("\n")
