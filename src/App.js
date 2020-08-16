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
  Divider,
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
    title: "Fall",
    courseIds: [],
  },
  "1w": {
    id: "1w",
    title: "Winter",
    courseIds: [],
  },
  "1s": {
    id: "1s",
    title: "Spring",
    courseIds: [],
  },
  "2f": {
    id: "2f",
    title: "Fall",
    courseIds: [],
  },
  "2w": {
    id: "2w",
    title: "Winter",
    courseIds: [],
  },
  "2s": {
    id: "2s",
    title: "Spring",
    courseIds: [],
  },
  "3f": {
    id: "3f",
    title: "Fall",
    courseIds: [],
  },
  "3w": {
    id: "3w",
    title: "Winter",
    courseIds: [],
  },
  "3s": {
    id: "3s",
    title: "Spring",
    courseIds: [],
  },
  "4f": {
    id: "4f",
    title: "Fall",
    courseIds: [],
  },
  "4w": {
    id: "4w",
    title: "Winter",
    courseIds: [],
  },
  "4s": {
    id: "4s",
    title: "Spring",
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
        return;
      }
    }

    const name = majors["depts"][Math.floor(Math.random() * majors["depts"].length)];
    const dept = majors["requirements"][name];
    const diff = majors["diffl"][Math.floor(Math.random() * majors["diffl"].length)];
    const major = dept[diff];

    this.state = {
      name: name,
      diff: diff,
      courses: dept.courses,
      selected: INIT_SELECTED,
      requirement: major.textreq,
      boolreq: major.boolreq,
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
      ethnicity: "",
      candmajor: "",
      standing: "",
      gpa: 3.0,
      moreqtrs: 2,
      advifreq: "",
      surveyed: false,
      uid: null,
    };
  }

  report = (type, payload) => {
    // console.log(type);
    // console.log(payload);

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
    var SUMTAG = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var year, cid, tag;
    var unique_count = new Set();
    for (year in this.state.selected){
      for (cid of this.state.selected[year]["courseIds"]){
        unique_count.add(cid.substring(0, cid.indexOf("-")));
      }
    }
    unique_count.forEach((cid) => {
      for (tag of this.state.courses[cid]["tag"]){
        SUMTAG[tag] += 1;
      }
    });
    var nfailed = [];
    this.state.boolreq.forEach((linereq, i) => {
      if(!eval(linereq))
        nfailed.push(i);
    });
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
      this.report("start", {major: this.state.name, difficulty: this.state.diff});
    }
  }

  restart = () => {
    window.localStorage.setItem("save", "cleared");
    window.location.reload(true);
  }

  checkout = () => {
    const nfailed = this.check();
    this.report("submit", {selection: this.state.selected, failed: nfailed});
    if (nfailed.length === 0){
      if (this.state.progress === 1){
        // successful, move onto the next major
        const name = majors["depts"][Math.floor(Math.random() * majors["depts"].length)];
        const dept = majors["requirements"][name];
        const diff = majors["diffl"][Math.floor(Math.random() * majors["diffl"].length)];
        const major = dept[diff];
        this.setState({
          checked: true,
          progress: 2,
          name: name,
          diff: diff,
          courses: dept.courses,
          selected: INIT_SELECTED,
          requirement: major.textreq,
          boolreq: major.boolreq,
          pool: {
            id: "pool",
            title: "Course Listing",
            courseIds: Object.keys(dept.courses),
          },
          failed: [],
        });
        this.report("start", {major: name, difficulty: diff});
      } else if (this.state.progress === 2){
        // successful, finished
        this.setState({failed: [], checked: true, progress: 3});
      }
    } else {
      // unsuccessful,
      this.setState({failed: nfailed, checked: true})
    }
  }

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
              "Great job! You have successfully graduated! Now moving onto the next major..."
              :
              "Does not meet major requirements! Please try again! " + this.state.failed.join(" ")}
          </Alert>
        </Snackbar>

        <Dialog open={this.state.progress === 3} maxWidth="lg">
          <DialogTitle>Thank you! You have completed the survey!</DialogTitle>
        </Dialog>

        <Dialog open={this.state.progress === 0} maxWidth="lg">
          <DialogTitle>Welcome</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Thank you for participating in our study! Before we begin, please tell us about yourself!
              Your information is used strictly for the purposes of this survey and will not be released to other parties.
            </DialogContentText>
            <Divider />
            <br />
            <FormControl error={this.state.surveyed && this.state.gender===""} size = "small" required style={{marginBottom: 5, width: "39%", padding: 5}}>
            <FormLabel >Please select the gender you identify the most with:</FormLabel>
              <RadioGroup row name="gender" value={this.state.gender} onChange={(event) => {this.setState({gender: event.target.value})}}>
                <FormControlLabel value="female" control={<Radio color="primary"/>} label="Female" />
                <FormControlLabel value="male" control={<Radio color="primary"/>} label="Male" />
                <FormControlLabel value="other" control={<Radio color="primary"/>} label="Other/Prefer not to state" />
              </RadioGroup>
            </FormControl>

            <FormControl error={this.state.surveyed && this.state.ethnicity===""} required style={{marginBottom: 5, width: "59%", padding: 5}}>
            <FormLabel >Please select the ethnicity that you identify the most with:</FormLabel>
             <Select
               labelId="ethnicity"
               id="ethnicity"
               value={this.state.ethnicity}
               onChange={(event)=>this.setState({ethnicity: event.target.value})}
             >
               <MenuItem value={"White"}>White</MenuItem>
               <MenuItem value={"Black"}>Black</MenuItem>
               <MenuItem value={"Asian"}>Asian</MenuItem>
               <MenuItem value={"Hispanic"}>Hispanic</MenuItem>
               <MenuItem value={"Multi-Racial"}>Multi-Racial</MenuItem>
               <MenuItem value={"Other"}>Other</MenuItem>
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
              <MenuItem value={1}>1st Year</MenuItem>
              <MenuItem value={2}>2nd Year</MenuItem>
              <MenuItem value={3}>3rd Year</MenuItem>
              <MenuItem value={4}>4th Year</MenuItem>
              <MenuItem value={5}>5th Year</MenuItem>
              <MenuItem value={6}>6th Year or Higher</MenuItem>
              <MenuItem value={0}>Graduate</MenuItem>
            </Select>
          </FormControl>

          <FormControl error={this.state.surveyed && this.state.advifreq===""} required style={{marginBottom: 5, width: "59%", padding: 5}} fullWidth>
            <FormLabel >How often do you meet with an academic advisor to discuss your class schedule?</FormLabel>
            <Select
              labelId="advifreq"
              id="advifreq"
              value={this.state.advifreq}
              onChange={(event)=>this.setState({advifreq: event.target.value})}
            >
              <MenuItem value={"Never"}>Never</MenuItem>
              <MenuItem value={"Very Rarely"}>Very Rarely</MenuItem>
              <MenuItem value={"Rarely"}>Rarely</MenuItem>
              <MenuItem value={"Occasionally"}>Occasionally</MenuItem>
              <MenuItem value={"Frequently"}>Frequently</MenuItem>
            </Select>
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

          <br />

          <FormControl required style={{marginBottom: 5, width: "39%", padding: 5}} fullWidth>
            <FormLabel style={{marginBottom: 23}}>Best estimate of your current cumulative GPA</FormLabel>
            <br />
            <Slider value={this.state.gpa} valueLabelDisplay="on" step={0.1} marks min={0} max={4} onChange={(event, newValue)=>this.setState({gpa: newValue})}/>
          </FormControl>

          <FormControl required style={{marginBottom: 5, width: "59%", padding: 5}} fullWidth>
            <FormLabel style={{marginBottom: 23}}>How many quarters (include current, and planned summer ones) do you have before graduating?</FormLabel>
            <br />
            <Slider value={this.state.moreqtrs} valueLabelDisplay="on" step={1} marks min={1} max={24} onChange={(event, newValue)=>this.setState({moreqtrs: newValue})}/>
          </FormControl>
          <br />

          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={()=>{this.setState({surveyed: true, progress: 1, help: true})}} color="primary">
              Skip
            </Button>
            <Button variant="contained" onClick={this.submitSurvey} color="primary">
              Continue
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.help} onClose={()=>{this.setState({help: false})}} style={{minWidth: "80%"}}>
          <DialogTitle>Instructions</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Make a four-year plan to satisfy the given requirements by dragging courses from the course list to your schedule on the left. When ready, click DO I GRADUATE? to see if you have fulfilled the requirements. Keep trying until your plan successfully graduates. Click the trashcan icon on courses to delete them; click the CLEAR button to clear all selections.
              <br />
              <br />
              Note that General Education requirements are not included in this study, and you are limited to two courses per quarter.
              <br />
              <br />
              You will be asked to create four-year plans for two separate majors.
              <hr />
              Your progress will be saved automatically. 
              If you would like to start over, click here to clear your saved progress and return to the initial survey. Warning: this action cannot be undone.
              <Button disableElevation fullWidth onClick={this.restart} color="secondary" variant="outlined" style={{marginTop: 5}}>
              restart
              </Button>
              <hr />
              Recommended: use 100% zoom on Google Chrome for the best experience!
              <br />
              <br />
              If you would like to see this message again, click on INSTRUCTIONS to the top right of the page.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={()=>{this.setState({help: false})}} color="primary">
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
                  <Typography variant = "h5" style={{verticalAlign: "middle", marginLeft: 10}}>
                  <strong>1</strong>
                  </Typography>
                  <div style={{flex: "1 1 auto", marginLeft: 3, display: "flex", justifyContent: "space-between"}}>
                    {["1f","1w","1s"].map(columnId => {
                      const column = this.state.selected[columnId];
                      const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                      return <Column delete={this.delete} key={column.id} column={column} courses={courses} />;
                    })}
                  </div>
                </div>

                <div style = {{flex: "1 1 auto", display: "flex"}}>
                  <Typography variant = "h5" style={{verticalAlign: "middle", marginLeft: 10}}>
                  <strong>2</strong>
                  </Typography>
                  <div style={{flex: "1 1 auto", marginLeft: 3, display: "flex", justifyContent: "space-between"}}>
                    {["2f","2w","2s"].map(columnId => {
                      const column = this.state.selected[columnId];
                      const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                      return <Column delete={this.delete} key={column.id} column={column} courses={courses} />;
                    })}
                  </div>
                </div>

                <div style = {{flex: "1 1 auto", display: "flex"}}>
                  <Typography variant = "h5" style={{verticalAlign: "middle", marginLeft: 10}}>
                  <strong>3</strong>
                  </Typography>
                  <div style={{flex: "1 1 auto", marginLeft: 3, display: "flex", justifyContent: "space-between"}}>
                    {["3f","3w","3s"].map(columnId => {
                      const column = this.state.selected[columnId];
                      const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                      return <Column delete={this.delete} key={column.id} column={column} courses={courses} />;
                    })}
                  </div>
                </div>

                <div style = {{flex: "1 1 auto", display: "flex"}}>
                  <Typography variant = "h5" style={{verticalAlign: "middle", marginLeft: 10}}>
                  <strong>4</strong>
                  </Typography>
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
                  <div style={{flex: "1 1 auto", marginLeft: 14, marginRight: 15}}>
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
