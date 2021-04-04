import React, { Component, Fragment } from "react";
import {
  Button,
  Grid,
  Toolbar,
  AppBar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  Slider,
  TextField,
  Checkbox,
  Divider,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  DragDropContext,
} from "react-beautiful-dnd";
import IdleTimer from 'react-idle-timer'
import Column from "./column";
import Pool from "./pool";
import majors from "./majors.json"

const INIT_SELECTED = {
  "1f": {
    id: "1f",
    courseIds: [],
  },
  "1w": {
    id: "1w",
    courseIds: [],
  },
  "1s": {
    id: "1s",
    courseIds: [],
  },
  "2f": {
    id: "2f",
    courseIds: [],
  },
  "2w": {
    id: "2w",
    courseIds: [],
  },
  "2s": {
    id: "2s",
    courseIds: [],
  },
  "3f": {
    id: "3f",
    courseIds: [],
  },
  "3w": {
    id: "3w",
    courseIds: [],
  },
  "3s": {
    id: "3s",
    courseIds: [],
  },
  "4f": {
    id: "4f",
    courseIds: [],
  },
  "4w": {
    id: "4w",
    courseIds: [],
  },
  "4s": {
    id: "4s",
    courseIds: [],
  },
}

class App extends Component {
  constructor(props) {
    super(props);

    let savedState = null;
    if (typeof Storage !== "undefined") {
      savedState = window.localStorage.getItem("save");
      if (savedState !== null && savedState !== "cleared") {
        this.state = JSON.parse(savedState);
        this.report("resume", {});
        return;
      }
    }

    const name = majors["depts"][Math.floor(Math.random() * majors["depts"].length)];
    // const name = "Economics"
    const dept = majors["requirements"][name];
    const diff = majors["diffl"][Math.floor(Math.random() * majors["diffl"].length)];
    // const diff = "1";
    const major = dept[diff];

    this.state = {
      name: name,
      diff: diff,
      courses: dept.courses,
      selected: INIT_SELECTED,
      requirement: major,
      boolreq: majors["boolreqs"][diff],
      pool: {
        id: "pool",
        title: "Course Listing",
        courseIds: Object.keys(dept.courses),
      },
      failed: [],
      checked: false,
      progress: 0,
      help: false,
      gender: "",
      ethnicity: [""],
      candmajor: "",
      standing: "",
      gpa: 3.0,
      moreqtrs: 15,
      advifreq: "",
      surveyed: false,
      uid: null,
      firsttime: true,

      pqed: false,
      pq1: "",
      pq21: false,
      pq21f: 0,
      pq22: false,
      pq22f: 0,
      pq23: false,
      pq23f: 0,
      pq24: false,
      pq24f: 0,
      pq25: false,
      pq25f: 0,
      pq3: "",
    };
  }

  report = (type, payload) => {
    // console.log(type);
    // console.log(payload);

    /*
    demographics - initial survey
    reflection - final survey questions
    start - the participant now has full access to the major selection task. This also contains information on what major and difficulty they are working on, as well as whether this is their first major or second major.
    select - the participant has dragged a course from the pool to the schedule. This also contains a snapshot of all the courses they have selected at this point, as well as a list (under failed) of the requirements that have not been fulfilled. The table above shows the number of failed requirements.
    idle - this is triggered when 1) there has been 60 seconds of inactivity (is this enough?), or 2) the user has closed the window.
    resume - this is triggered when 1) the user resumes activity, or 2) the user has opened the site again. Browsers and the internet can be finicky, so this second trigger is not perfect (same with when the user closes the window); I should be able to account for this when processing the raw data.
    delete - the participant has deleted a course. This comes also with a snapshot of their selections and the number of requirements failed.
    clear - same as above, except everything has been deleted.
    edit - not shown above, but this is when the participant drags a course between quarters.
    submit - the participant has hit the DO I GRADUATE button. It also comes with their selection and how many failed.
    restart - the participant has hit the restart button and created a new id. All records for this current id will be scrapped.
    */

    fetch(
      "https://pleaserunforme.herokuapp.com/log/"+type+"/"+this.state.uid,
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify(payload),
      });
  }

  check = () => {
    var SUMTAG = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var year, cid, tag;
    var unique_count = new Set();
    for (year in this.state.selected){
      for (cid of this.state.selected[year]["courseIds"]){
        // Build unique set of all courses (remove dups)
        // taking only the id part of the course name added
        unique_count.add(cid.substring(0, cid.indexOf("-")));
      }
    }
    unique_count.forEach((cid) => {
      console.log(cid);
      // Each course might have multiple tags (turned out to be unnecessary)
      for (tag of this.state.courses[cid]["tag"]){
        SUMTAG[tag] += 1;
      }
    });
    var nfailed = [];
    this.state.boolreq.forEach((linereq, i) => {
      // 0-based which line of requirments was failed
      if(!eval(linereq)){
        nfailed.push(i);
        console.log(linereq);
      }
    });
    console.log(SUMTAG)
    return nfailed;
  }

  clear = () => {
    this.setState({selected: INIT_SELECTED}, ()=>{
      this.report("clear", {selection: INIT_SELECTED, failed: this.check()});
    });
  }

  delete = (parentId, index, draggableId) => {
    // delete if source is not pool
    const start = this.state.selected[parentId];
    const startCourseIds = Array.from(start.courseIds);
    startCourseIds.splice(index, 1);
    const newStart = {
      ...start,
      courseIds: startCourseIds,
    };
    const newState = {
      ...this.state,
      selected: {
        ...this.state.selected,
        [newStart.id]: newStart,
      },
    };
    this.setState(newState, ()=>{this.report("delete", {selection: this.state.selected, failed: this.check()});});
    window.localStorage.setItem("save", JSON.stringify(newState));
    return;
  }

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination){
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index) {
      // did not change
      return;
    }

    if (this.state.selected[destination.droppableId].courseIds.length === 2){
      // hit the maximum 2/qtr
      return;
    }

    if (destination.droppableId !== "pool"){
      if (source.droppableId === "pool"){
        // Pool to selection
        const column = this.state.selected[destination.droppableId];
        const newCourseIds = Array.from(column.courseIds);
        var newCourse = draggableId + "-" + Math.floor(Math.random() * 10000).toString();
        newCourseIds.splice(destination.index, 0, newCourse);

        const newColumn = {
          ...column,
          courseIds: newCourseIds,
        }

        const newCourseContent = {
          ...this.state.courses[draggableId],
          id: newCourse,
        }
        const newState = {
          ...this.state,
          selected: {
            ...this.state.selected,
            [newColumn.id]: newColumn,
          },
          courses: {
            ...this.state.courses,
            [newCourse]: newCourseContent,
          },
        };
        this.setState(newState, ()=>{this.report("select", {selection: this.state.selected, failed: this.check()})});
        window.localStorage.setItem("save", JSON.stringify(newState));
      } else {
        // Move between columns
        const start = this.state.selected[source.droppableId];
        const finish = this.state.selected[destination.droppableId];

        const startCourseIds = Array.from(start.courseIds);
        startCourseIds.splice(source.index, 1);
        const newStart = {
          ...start,
          courseIds: startCourseIds,
        };

        const finishCourseIds = Array.from(finish.courseIds);
        finishCourseIds.splice(destination.index, 0, draggableId);
        const newFinish = {
          ...finish,
          courseIds: finishCourseIds,
        };
        const newState = {
          ...this.state,
          selected: {
            ...this.state.selected,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish,
          },
        };
        this.setState(newState, ()=>{this.report("edit", {selection: this.state.selected, failed: this.check()})});
        window.localStorage.setItem("save", JSON.stringify(newState));
      }
    } else {
      return;
    }
  }

  componentDidMount = () => {
    window.addEventListener('beforeunload', (event) => {
      this.report("idle", {});
    });
  };

  closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({checked: false});
  };

  submitSurvey = () => {
    if (this.state.gender === "" || this.state.ethnicity === "" || this.state.candmajor === "" || this.state.standing === ""
     || this.state.advifreq === "") {
      this.setState({surveyed: true});
    } else {
      const uid =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      this.setState({
        surveyed: true, progress: 1, help: true, uid: uid
      }, ()=>{
        window.localStorage.setItem("save", JSON.stringify(this.state));
      });
      const payload = {
        gender: this.state.gender,
        ethnicity: this.state.ethnicity,
        candmajor: this.state.candmajor,
        standing: this.state.standing,
        advifreq: this.state.advifreq,
        moreqtrs: this.state.moreqtrs,
        gpa: this.state.gpa
      };
      // console.log(payload);
      this.report("demographics", payload);
    }
  };

  submitReflection = () => {
    if (this.state.pq1 === "" || this.state.pq3 === "") {
      this.setState({pqed: true});
    } else {
      this.setState({progress: 5, help: false, pqed: true}, ()=>{
        window.localStorage.setItem("save", JSON.stringify(this.state));
      });
      const payload = {
        pq1:this.state.pq1,
        pq21:this.state.pq21,
        pq21f:this.state.pq21f,
        pq22:this.state.pq22,
        pq22f:this.state.pq22f,
        pq23:this.state.pq23,
        pq23f:this.state.pq23f,
        pq24:this.state.pq24,
        pq24f:this.state.pq24f,
        pq25:this.state.pq25,
        pq25f:this.state.pq25f,
        pq3:this.state.pq3
      };
      console.log(payload);
      this.report("reflection", payload);
    }
  };

  closeInstructions = () => {
    if (this.state.firsttime){
      this.setState({help: false, firsttime: false});
      this.report("start", {major: this.state.name, difficulty: this.state.diff, progress: 1});
    } else {
      this.setState({help: false});
    }
  };

  restart = () => {
    this.report("restart", {});
    window.localStorage.setItem("save", "cleared");
    window.location.reload(true);
  }

  checkout = () => {
    const nfailed = this.check();
    console.log(nfailed.join(" "));
    this.report("submit", {selection: this.state.selected, failed: nfailed});
    if (nfailed.length === 0){
      if (this.state.progress === 1){
        // successful, move onto the next major
        let name;
        do { // different department
          name = majors["depts"][Math.floor(Math.random() * majors["depts"].length)];
        } while (name === this.state.name);
        const dept = majors["requirements"][name];
        let diff;
        do { // different difficulty
          diff = majors["diffl"][Math.floor(Math.random() * majors["diffl"].length)];
        } while (diff === this.state.diff);
        const major = dept[diff];
        this.setState({
          checked: true,
          progress: 2,
          name: name,
          diff: diff,
          courses: dept.courses,
          selected: INIT_SELECTED,
          requirement: major,
          boolreq: majors["boolreqs"][diff],
          pool: {
            id: "pool",
            title: "Course Listing",
            courseIds: Object.keys(dept.courses),
          },
          failed: [],
        }, ()=>{window.localStorage.setItem("save", JSON.stringify(this.state));});
        this.report("start", {major: name, difficulty: diff, progress: 2});
      } else if (this.state.progress === 2){
        // successful, finished
        this.setState({failed: [], checked: true, progress: 3}, ()=>{
          window.localStorage.setItem("save", JSON.stringify(this.state));
        });
      }
    } else {
      // unsuccessful,
      this.setState({failed: nfailed, checked: true})
    }
  }

  handleCheck = (event) => {
    this.setState({[event.target.name]: event.target.checked });
  };

  render() {
    return (
      <Fragment>
      <IdleTimer
        ref={ref => { this.idleTimer = ref }}
        timeout={1000 * 60}
        onAction={(event)=>{
          this.report("granular", {type: event.type})
          // console.log('user did something', event);
        }}
        onActive={(event)=>{
          this.report("resume", {})
          // console.log('user is active', event);
        }}
        onIdle={(event)=>{
          this.report("idle", {})
          // console.log('user is idle', event);
        }}
        debounce={250}
        />
        <AppBar
          position="static"
          style={{
            marginBottom: "3px",
            boxShadow: "none",
            backgroundColor: "#f6f63f"
          }}
        >
          <Toolbar variant="dense">
            <Typography variant="h6" style={{ flexGrow: 1, color:"black" }}>
              <strong>{"Four-Year Planner"}</strong>
            </Typography>

            <Typography variant="body2" style={{ flexGrow: 1, color:"black" }}>
              {"Major "+this.state.progress+" of 2"}
            </Typography>

            <Button disableElevation onClick={this.clear}  size="small" variant="contained" style={{marginRight: 15}}>
              clear
            </Button>

            <Button disableElevation onClick={()=>this.setState({help: true}, ()=>{this.report("help", {})})}  size="small" variant="contained" style={{marginRight: 15}}>
              instructions
            </Button>

            <Button onClick={this.checkout} size="small" variant="contained" style={{backgroundColor: "#f3682b"}}>
              do i graduate?
            </Button>
          </Toolbar>
        </AppBar>

        <Snackbar open={this.state.checked} autoHideDuration={6000} onClose={this.closeSnackbar} anchorOrigin={{vertical: "top", horizontal: "right"}}>
          <Alert onClose={this.closeSnackbar} severity= {(this.state.failed.length === 0) ? "success" : "error"}>
            {(this.state.failed.length === 0) ?
              ("Great job! You have successfully graduated!" + ((this.state.progress === 2) ? "Now moving onto the next major..." : ""))
              :
              "Does not meet major requirements! Please try again!"}
          </Alert>
        </Snackbar>

        <Dialog open={this.state.progress === 3} maxWidth="lg">
          <DialogTitle>You're almost done! Please tell us about your experience</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Think back to your experience and please answer as accurately and completely as you can.
            </DialogContentText>
            <Divider />
            <br />
            <FormControl error={this.state.pqed && this.state.pq1===""} required fullWidth style={{marginBottom: 5, padding: 5, width: "99%"}}>
              <FormLabel >1. As you were figuring out which classes would complete the major course requirements, what aspects of the requirements did you find most difficult?</FormLabel>
              <TextField
                error={this.state.pqed && this.state.pq1===""}
                value={this.state.pq1}
                onChange={(event)=>this.setState({pq1: event.target.value})}
                style={{marginTop: 5}}
              />
            </FormControl>

            <FormControl required fullWidth style={{marginBottom: 5, padding: 5, width: "99%"}}>
              <FormLabel >2. As you were selecting classes to fulfill the major requirements, which of the following mistakes did you make?</FormLabel>
              <br />
              <Accordion expanded={this.state.pq21} style={{margin: 0, padding: 0}}>
                <AccordionSummary elevation={0} id="pq21">
                  <FormControlLabel
                    control={<Checkbox checked={this.state.pq21} onChange={this.handleCheck} name="pq21"/>}
                    label={<Typography color="textSecondary">Trying to take two classes that couldn’t be taken together (e.g., Creative Writing 3C and 3D in the following example: <em>“Creative Writing 3A, and <strong>3C or 3D”</strong></em>)</Typography>}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="textSecondary" style={{padding: 10}}>
                    How difficult was it to find the problem after you had made the mistake?
                  </Typography>
                  <FormControl variant="outlined" style={{marginLeft: 10, minWidth: 150}}>
                    <InputLabel>Difficulty</InputLabel>
                    <Select id="pq21f" autoWidth value={this.state.pq21f} onChange={(event)=>{this.setState({pq21f: event.target.value})}}>
                      <MenuItem value={1}>Very Easy</MenuItem>
                      <MenuItem value={2}>Somewhat Easy</MenuItem>
                      <MenuItem value={3}>Somewhat Difficult</MenuItem>
                      <MenuItem value={4}>Very Difficult</MenuItem>
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={this.state.pq22} style={{margin: 0, padding: 0}}>
                <AccordionSummary elevation={0} id="pq22">
                  <FormControlLabel
                    control={<Checkbox checked={this.state.pq22} onChange={this.handleCheck} name="pq22"/>}
                    label={<Typography color="textSecondary">Trying to take only one class of a pair of classes that had to be taken together (e.g., English 109 and 109A in the following example <em>“English 105, 107, <strong>109 + 109A (must take BOTH courses for it to count)</strong>, 111, 114”</em>)</Typography>}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="textSecondary" style={{padding: 10}}>
                    How difficult was it to find the problem after you had made the mistake?
                  </Typography>
                  <FormControl variant="outlined" style={{marginLeft: 10, minWidth: 150}}>
                    <InputLabel>Difficulty</InputLabel>
                    <Select id="pq22f" autoWidth value={this.state.pq22f} onChange={(event)=>{this.setState({pq22f: event.target.value})}}>
                      <MenuItem value={1}>Very Easy</MenuItem>
                      <MenuItem value={2}>Somewhat Easy</MenuItem>
                      <MenuItem value={3}>Somewhat Difficult</MenuItem>
                      <MenuItem value={4}>Very Difficult</MenuItem>
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={this.state.pq23} style={{margin: 0, padding: 0}}>
                <AccordionSummary elevation={0} id="pq23">
                  <FormControlLabel
                    control={<Checkbox checked={this.state.pq23} onChange={this.handleCheck} name="pq23"/>}
                    label={<Typography color="textSecondary">Not realizing that I had already used a class to fulfill an earlier requirement</Typography>}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="textSecondary" style={{padding: 10}}>
                    How difficult was it to find the problem after you had made the mistake?
                  </Typography>
                  <FormControl variant="outlined" style={{marginLeft: 10, minWidth: 150}}>
                    <InputLabel>Difficulty</InputLabel>
                    <Select id="pq23f" autoWidth value={this.state.pq23f} onChange={(event)=>{this.setState({pq23f: event.target.value})}}>
                      <MenuItem value={1}>Very Easy</MenuItem>
                      <MenuItem value={2}>Somewhat Easy</MenuItem>
                      <MenuItem value={3}>Somewhat Difficult</MenuItem>
                      <MenuItem value={4}>Very Difficult</MenuItem>
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={this.state.pq24} style={{margin: 0, padding: 0}}>
                <AccordionSummary elevation={0} id="pq24">
                  <FormControlLabel
                    control={<Checkbox checked={this.state.pq24} onChange={this.handleCheck} name="pq24"/>}
                    label={<Typography color="textSecondary">Not reading subrules under requirements (e.g., <em>“At least two courses taken to fulfill this requirement must be ecology & evolutionary biology courses”</em>)</Typography>}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="textSecondary" style={{padding: 10}}>
                    How difficult was it to find the problem after you had made the mistake?
                  </Typography>
                  <FormControl variant="outlined" style={{marginLeft: 10, minWidth: 150}}>
                    <InputLabel>Difficulty</InputLabel>
                    <Select id="pq24f" autoWidth value={this.state.pq24f} onChange={(event)=>{this.setState({pq24f: event.target.value})}}>
                      <MenuItem value={1}>Very Easy</MenuItem>
                      <MenuItem value={2}>Somewhat Easy</MenuItem>
                      <MenuItem value={3}>Somewhat Difficult</MenuItem>
                      <MenuItem value={4}>Very Difficult</MenuItem>
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={this.state.pq25} style={{margin: 0, padding: 0}}>
                <AccordionSummary elevation={0} id="pq25">
                  <FormControlLabel
                    control={<Checkbox checked={this.state.pq25} onChange={this.handleCheck} name="pq25"/>}
                    label={<Typography color="textSecondary">Not taking enough classes for a given requirement</Typography>}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="textSecondary" style={{padding: 10}}>
                    How difficult was it to find the problem after you had made the mistake?
                  </Typography>
                  <FormControl variant="outlined" style={{marginLeft: 10, minWidth: 150}}>
                    <InputLabel>Difficulty</InputLabel>
                    <Select id="pq25f" autoWidth value={this.state.pq25f} onChange={(event)=>{this.setState({pq25f: event.target.value})}}>
                      <MenuItem value={1}>Very Easy</MenuItem>
                      <MenuItem value={2}>Somewhat Easy</MenuItem>
                      <MenuItem value={3}>Somewhat Difficult</MenuItem>
                      <MenuItem value={4}>Very Difficult</MenuItem>
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>
            </FormControl>

            <FormControl error={this.state.pqed && this.state.pq3===""} required fullWidth style={{marginBottom: 5, padding: 5, width: "99%"}}>
              <FormLabel >3. Think about your own experiences choosing classes each term. What could UCI or your department do to make the process easier for you (e.g., changing how requirements are presented, where you get information, or what the requirements are)?</FormLabel>
              <TextField
                error={this.state.pqed && this.state.pq3===""}
                value={this.state.pq3}
                onChange={(event)=>this.setState({pq3: event.target.value})}
                style={{marginTop: 5}}
              />
            </FormControl>

          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={this.submitReflection} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.progress === 5} maxWidth="lg">
          <DialogTitle>Thank you!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your response has been recorded. Thank you for your time!
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog open={this.state.progress === 0} maxWidth="lg">
          <DialogTitle>Welcome! Thank you for participating in our study! </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Before we begin, please tell us about yourself!
              Your information is used strictly for the purposes of this survey and will not be released to other parties.
              Please try to provide as much information as possible!
              <br />
              Recommended: use 100% zoom on Google Chrome for the best experience!
            </DialogContentText>
            <Divider />
            <br />
            <FormControl error={this.state.surveyed && this.state.gender===""} size = "small" required style={{marginBottom: 5, width: "39%", padding: 5}}>
            <FormLabel >Please select the gender you identify the most with:</FormLabel>
              <RadioGroup row name="gender" value={this.state.gender} onChange={(event) => {this.setState({gender: event.target.value})}}>
                <FormControlLabel value="female" control={<Radio color="primary"/>} label="Female" />
                <FormControlLabel value="male" control={<Radio color="primary"/>} label="Male" />
                <FormControlLabel value="other" control={<Radio color="primary"/>} label="Other" />
                <FormControlLabel value="nosay" control={<Radio color="primary"/>} label="Prefer not to state" />
              </RadioGroup>
            </FormControl>

            <FormControl error={this.state.surveyed && this.state.ethnicity===""} required style={{marginBottom: 5, width: "59%", padding: 5}}>
            <FormLabel >Please select all ethnicities that you identify with:</FormLabel>
             <Select
               labelId="ethnicity"
               id="ethnicity"
               value={this.state.ethnicity}
               multiple
               onChange={(event)=>this.setState({ethnicity: event.target.value})}
             >
               <MenuItem value={"White"}>White</MenuItem>
               <MenuItem value={"Black"}>Black</MenuItem>
               <MenuItem value={"Asian"}>Asian</MenuItem>
               <MenuItem value={"Hispanic"}>Hispanic</MenuItem>
               <MenuItem value={"Multi-Racial"}>Multi-Racial</MenuItem>
               <MenuItem value={"Other"}>Other</MenuItem>
               <MenuItem value={"Nosay"}>Prefer not to state</MenuItem>
             </Select>
           </FormControl>

           <br />

           <FormControl error={this.state.surveyed && this.state.standing===""} required fullWidth style={{marginBottom: 5, width: "39%", padding: 5}}>
            <FormLabel >What is your current standing in college?</FormLabel>
            <Select
              labelId="standing"
              id="standing"
              value={this.state.standing}
              onChange={(event)=>this.setState({standing: event.target.value})}
            >
              <MenuItem value={1}>1st year</MenuItem>
              <MenuItem value={2}>2nd year</MenuItem>
              <MenuItem value={3}>3rd year</MenuItem>
              <MenuItem value={4}>4th year</MenuItem>
              <MenuItem value={5}>5th year</MenuItem>
              <MenuItem value={6}>6th year or higher</MenuItem>
              <MenuItem value={0}>Graduate</MenuItem>
              <MenuItem value={9}>Prefer not to state</MenuItem>
            </Select>
          </FormControl>

          <FormControl error={this.state.surveyed && this.state.advifreq===""} required style={{marginBottom: 5, width: "59%", padding: 5}} fullWidth>
            <FormLabel >How often have you met with an academic advisor about your schedule in the last school year?</FormLabel>
            <Select
              labelId="advifreq"
              id="advifreq"
              value={this.state.advifreq}
              onChange={(event)=>this.setState({advifreq: event.target.value})}
            >
              <MenuItem value={"Never"}>Never</MenuItem>
              <MenuItem value={"Very Rarely"}>Once or twice</MenuItem>
              <MenuItem value={"Rarely"}>Between two and five times</MenuItem>
              <MenuItem value={"Occasionally"}>Between five and ten times</MenuItem>
              <MenuItem value={"Frequently"}>More than ten times</MenuItem>
              <MenuItem value={"Nosay"}>Prefer not to state</MenuItem>
            </Select>
          </FormControl>

          <br />

          <FormControl required style={{width: "39%", padding: 5}} fullWidth>
            <FormLabel >Best estimate of your current cumulative GPA</FormLabel>
            <br />
            <Slider disabled={this.state.gpa === 5} value={this.state.gpa} valueLabelDisplay="on" step={0.1} marks min={0} max={4} onChange={(event, newValue)=>this.setState({gpa: newValue})}/>
            <FormControlLabel
              control={<Checkbox color="primary" checked={this.state.gpa === 5} onChange={(event)=>{this.setState({gpa: (event.target.checked? 5 : 3)})}} size="small" />}
              label="Check here if you would prefer to not state your GPA"
            />
          </FormControl>

          <FormControl required style={{width: "59%", padding: 5}} fullWidth>
            <FormLabel >How many quarters (include current, and planned summer ones) do you have before graduating?</FormLabel>
            <br />
            <Slider disabled={this.state.moreqtrs === 99} value={this.state.moreqtrs} valueLabelDisplay="on" step={1} marks min={1} max={24} onChange={(event, newValue)=>this.setState({moreqtrs: newValue})}/>
            <FormControlLabel
              control={<Checkbox color="primary" checked={this.state.moreqtrs === 99} onChange={(event)=>{this.setState({moreqtrs: (event.target.checked? 99 : 15)})}} size="small" />}
              label="Check here if you do not expect to graduate"
            />
          </FormControl>

          <br />

          <FormControl error={this.state.surveyed && this.state.candmajor===""} required fullWidth style={{marginBottom: 5, padding: 5, width: "99%"}}>
            <FormLabel >Please enter your major(s)</FormLabel>
            <TextField
              error={this.state.surveyed && this.state.candmajor===""}
              value={this.state.candmajor}
              onChange={(event)=>this.setState({candmajor: event.target.value})}
            />
          </FormControl>

          </DialogContent>
          <DialogActions>
            {/*
              <Button variant="outlined" onClick={()=>{this.setState({surveyed: true, progress: 1, help: true})}} color="primary">
                Skip
              </Button>
              */}
            <Button variant="contained" onClick={this.submitSurvey} color="primary">
              Continue
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.help} onClose={this.closeInstructions} style={{minWidth: "80%"}}>
          <DialogTitle>Instructions: Please read carefully!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Make a four-year plan to satisfy the given major requirements by dragging courses from the course list to your schedule. Click DO I GRADUATE? to see if you have met the requirements.
              Keep trying until you successfully graduate. Click the trashcan icon on courses to delete them; click the CLEAR button to clear all selections.
              <br />
              <br />
              Note that General Education requirements are not included in this study, and you are limited to two courses per quarter. Each course you choose will only count towards one requirement.
              <br />
              <br />
              You will be asked to create four-year plans for two separate majors.
              <hr />
              Your progress will be saved automatically. You may close this page and return at any point.
              If you would like to start over, click here to clear your saved progress and return to the initial survey. Warning: this action cannot be undone.
              <Button disableElevation fullWidth onClick={this.restart} color="secondary" variant="outlined" style={{marginTop: 5}}>
              restart
              </Button>
              <hr />
              If you would like to see this message again, click on INSTRUCTIONS to the top right of the page.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={this.closeInstructions} color="primary">
              Continue
            </Button>
          </DialogActions>
        </Dialog>

        <DragDropContext onDragEnd={this.onDragEnd}>
          <Grid container>
            <Grid item xs={12} s={6} md={6} lg={6} xl={6}>
              <div style = {{flex: "1 1 auto", display: "flex", minHeight: 0, height: "4%"}}>
                <div style={{marginLeft: 10, width: "15px"}}/>
                <div style={{flex: "1 1 auto", marginLeft: 8, display: "flex", justifyContent: "space-between"}}>
                    <p style={{margin: 3, width: "100%", textAlign: "center"}}>
                      <strong>Fall</strong>
                    </p>
                    <p style={{margin: 3, width: "100%", textAlign: "center"}}>
                      <strong>Winter</strong>
                    </p>
                    <p style={{margin: 3, width: "100%", textAlign: "center"}}>
                      <strong>Spring</strong>
                    </p>
                </div>
              </div>
              <div style = {{display: "flex", flexFlow: "column", height: "96%"}}>
                <div style = {{flex: "1 1 auto", display: "flex"}}>
                  <div>
                    <Typography variant = "caption" style={{verticalAlign: "middle", marginLeft: 10}}>
                    year
                    </Typography>
                    <Typography variant = "h5" style={{verticalAlign: "middle", marginLeft: 10}}>
                    <strong>1</strong>
                    </Typography>
                  </div>
                  <div style={{flex: "1 1 auto", marginLeft: 3, display: "flex", justifyContent: "space-between"}}>
                    {["1f","1w","1s"].map(columnId => {
                      const column = this.state.selected[columnId];
                      const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                      return <Column delete={this.delete} key={column.id} column={column} courses={courses} />;
                    })}
                  </div>
                </div>

                <div style = {{flex: "1 1 auto", display: "flex"}}>
                  <div>
                    <Typography variant = "caption" style={{verticalAlign: "middle", marginLeft: 10}}>
                    year
                    </Typography>
                    <Typography variant = "h5" style={{verticalAlign: "middle", marginLeft: 10}}>
                    <strong>2</strong>
                    </Typography>
                  </div>
                  <div style={{flex: "1 1 auto", marginLeft: 3, display: "flex", justifyContent: "space-between"}}>
                    {["2f","2w","2s"].map(columnId => {
                      const column = this.state.selected[columnId];
                      const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                      return <Column delete={this.delete} key={column.id} column={column} courses={courses} />;
                    })}
                  </div>
                </div>

                <div style = {{flex: "1 1 auto", display: "flex"}}>
                  <div>
                    <Typography variant = "caption" style={{verticalAlign: "middle", marginLeft: 10}}>
                    year
                    </Typography>
                    <Typography variant = "h5" style={{verticalAlign: "middle", marginLeft: 10}}>
                    <strong>3</strong>
                    </Typography>
                  </div>
                  <div style={{flex: "1 1 auto", marginLeft: 3, display: "flex", justifyContent: "space-between"}}>
                    {["3f","3w","3s"].map(columnId => {
                      const column = this.state.selected[columnId];
                      const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                      return <Column delete={this.delete} key={column.id} column={column} courses={courses} />;
                    })}
                  </div>
                </div>

                <div style = {{flex: "1 1 auto", display: "flex"}}>
                  <div>
                    <Typography variant = "caption" style={{verticalAlign: "middle", marginLeft: 10}}>
                    year
                    </Typography>
                    <Typography variant = "h5" style={{verticalAlign: "middle", marginLeft: 10}}>
                    <strong>4</strong>
                    </Typography>
                  </div>
                  <div style={{flex: "1 1 auto", marginLeft: 3, display: "flex", justifyContent: "space-between"}}>
                    {["4f","4w","4s"].map(columnId => {
                      const column = this.state.selected[columnId];
                      const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                      return <Column delete={this.delete} key={column.id} column={column} courses={courses} />;
                    })}
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} s={6} md={6} lg={6} xl={6}>
              <div style={{display: "flex", flexFlow: "row", position: "relative", height: "calc(100vh - 62px + 9px)"}}>
                <div style={{flex: "0 1 auto", height: "100%"}}>
                  <Pool key={"pool"} column={this.state.pool} courses={this.state.pool.courseIds.map(courseId => this.state.courses[courseId])} />
                </div>

                <div style={{backgroundColor: "#fdfddd", overflow: "auto"}}>
                  <Typography variant="body1" style={{marginBottom: 5, marginTop: 5, textAlign: "center"}}>
                    <strong>Requirements</strong>
                  </Typography>
                  <br />
                  <div style={{flex: "1 1 auto", marginLeft: 14, marginRight: 15}}>
                    <Typography variant="body1">
                      {this.state.name}
                    </Typography>
                    <br />
                    <Typography variant="body2" style={{whiteSpace: "pre-line"}}>
                      <div dangerouslySetInnerHTML = {{"__html": this.state.requirement}} />
                    </Typography>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </DragDropContext>
      </Fragment>
    );
  }
}

export default App;
