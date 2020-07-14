import React, { Component, Fragment } from 'react';
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
  InputLabel,
  Slider,
  TextField,
  Divider,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {
  DragDropContext,
} from 'react-beautiful-dnd';
import Column from './column';
import Pool from './pool';
import majors from './majors.json'

const INIT_SELECTED = {
  '1f': {
    id: '1f',
    title: 'Fall',
    courseIds: [],
  },
  '1w': {
    id: '1w',
    title: 'Winter',
    courseIds: [],
  },
  '1s': {
    id: '1s',
    title: 'Spring',
    courseIds: [],
  },
  '2f': {
    id: '2f',
    title: 'Fall',
    courseIds: [],
  },
  '2w': {
    id: '2w',
    title: 'Winter',
    courseIds: [],
  },
  '2s': {
    id: '2s',
    title: 'Spring',
    courseIds: [],
  },
  '3f': {
    id: '3f',
    title: 'Fall',
    courseIds: [],
  },
  '3w': {
    id: '3w',
    title: 'Winter',
    courseIds: [],
  },
  '3s': {
    id: '3s',
    title: 'Spring',
    courseIds: [],
  },
  '4f': {
    id: '4f',
    title: 'Fall',
    courseIds: [],
  },
  '4w': {
    id: '4w',
    title: 'Winter',
    courseIds: [],
  },
  '4s': {
    id: '4s',
    title: 'Spring',
    courseIds: [],
  },
}

const MIN = (a,b) => {
  return (a>b) ? b : a;
}

class App extends Component {
  constructor(props) {
    super(props);

    const name = "Evolutionary Biology";
    const dept = majors["requirements"][name];
    const major = dept[4];

    this.state = {
      name: name,
      courses: dept.courses,
      selected: INIT_SELECTED,
      pool: {
        id: 'pool',
        title: 'Course Listing',
        courseIds: Object.keys(dept.courses),
      },
      failed: [],
      checked: false,
      progress: 0,
      help: false,
      requirement: major.textreq,
      boolreq: major.boolreq,
      gender: "",
      ethnicity: "",
      candmajor: "",
      standing: "",
      gpa: 3.0,
      moreyears: 2,
      advifreq: "",
      surveyed: false,
    };
  }

  checkout = () => {
    var SUMTAG = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    var year, cid, tag;
    var unique_count = new Set();
    for (year in this.state.selected){
      for (cid of this.state.selected[year]['courseIds']){
        unique_count.add(cid.substring(0, cid.indexOf('-')));
      }
    }
    unique_count.forEach((cid) => {
      for (tag of this.state.courses[cid]['tag']){
        SUMTAG[tag] += 1;
      }
    });
    var nfailed = [];
    this.state.boolreq.forEach((linereq, i) => {
      if(!eval(linereq))
        nfailed.push(i);
    });
    this.setState({failed: nfailed, checked: true});
    console.log(nfailed);
  }

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination){
      // delete if source is not pool
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

    if (destination.droppableId !== 'pool'){
      if (source.droppableId === 'pool'){
        const column = this.state.selected[destination.droppableId];
        const newCourseIds = Array.from(column.courseIds);
        var newCourse = draggableId + '-' + Math.floor(Math.random() * 1000).toString();
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
          }
        };

        this.setState(newState);
      } else {
        // Move between columns
        return;
      }
    } else {
      return;
    }
  }

  closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({checked: false});
  };

  submitSurvey = () => {
    if (this.state.gender === "" || this.state.ethnicity === "" || this.state.candmajor === "" || this.state.standing === ""
     || this.state.advifreq === "") {
      this.setState({surveyed: true});
    } else {
      this.setState({surveyed: true, progress: 1, help: true});
    }
  }

  render() {
    return (
      <Fragment>
        <AppBar
          position="static"
          style={{
            marginBottom: '3px',
            boxShadow: 'none',
            backgroundColor: '#2196f3'
          }}
        >
          <Toolbar variant="dense">
            <Typography variant='h6' style={{ flexGrow: 1 }}>
              {'Major Requirements Complexity'}
            </Typography>

            <Typography variant='body2' style={{ flexGrow: 1 }}>
              {'Major '+this.state.progress+' of 2'}
            </Typography>

            <Button onClick={()=>this.setState({selected: INIT_SELECTED})}  size="small" variant="contained" style={{marginRight: 15}}>
            clear
            </Button>

            <Button onClick={()=>this.setState({help: true})}  size="small" variant="contained" style={{marginRight: 15}}>
            instructions
            </Button>

            <Button onClick={this.checkout} size="small" variant="contained" color="secondary">
            checkout
            </Button>
          </Toolbar>
        </AppBar>

        <Snackbar open={this.state.checked} autoHideDuration={6000} onClose={this.closeSnackbar} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
          <Alert onClose={this.closeSnackbar} severity= {(this.state.failed.length === 0) ? "success" : "error"}>
            {(this.state.failed) ?
              "Failed! " + this.state.failed.join(' ')
              :
              "Success! Graduated!"}
          </Alert>
        </Snackbar>

        <Dialog open={this.state.progress === 0} maxWidth="lg">
          <DialogTitle>Welcome</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Thank you for participating in our study! Before we begin, please tell us about yourself!
              Your information is used strictly for the purposes of this survey and will not be released to other parties.
            </DialogContentText>
            <Divider />
            <br />
            <FormControl error={this.state.surveyed && this.state.gender===''} size = "small" required style={{marginBottom: 5, width: "49%", padding: 5}}>
            <FormLabel >Please select the gender you identify the most with:</FormLabel>
              <RadioGroup row name="gender" value={this.state.gender} onChange={(event) => {this.setState({gender: event.target.value})}}>
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other/Prefer not to state" />
              </RadioGroup>
            </FormControl>

            <FormControl error={this.state.surveyed && this.state.ethnicity===''} required style={{marginBottom: 5, width: "49%", padding: 5}}>
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

           <FormControl error={this.state.surveyed && this.state.standing===''} required fullWidth style={{marginBottom: 5, width: "49%", padding: 5}}>
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

          <FormControl error={this.state.surveyed && this.state.advifreq===''} required style={{marginBottom: 5, width: "49%", padding: 5}} fullWidth>
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

          <FormControl error={this.state.surveyed && this.state.candmajor===''} required fullWidth style={{marginBottom: 5, padding: 5, width: "99%"}}>
            <FormLabel >Please enter your major(s)</FormLabel>
            <TextField
              error={this.state.surveyed && this.state.candmajor===''}
              value={this.state.candmajor}
              onChange={(event)=>this.setState({candmajor: event.target.value})}
            />
          </FormControl>

          <br />

          <FormControl required style={{marginBottom: 5, width: "49%", padding: 5}} fullWidth>
            <FormLabel style={{marginBottom: 23}}>Best estimate of your current cumulative GPA</FormLabel>
            <br />
            <Slider defaultValue={this.state.gpa} valueLabelDisplay="on" step={0.1} marks min={0} max={4} onChange={(event)=>this.setState({gpa: event.target.value})}/>
          </FormControl>

          <FormControl required style={{marginBottom: 5, width: "49%", padding: 5}} fullWidth>
            <FormLabel style={{marginBottom: 23}}>How many MORE years do you expect it to take for you to graduate?</FormLabel>
            <br />
            <Slider defaultValue={this.state.moreyears} valueLabelDisplay="on" step={1} marks min={1} max={5} onChange={(event)=>this.setState({moreyears: event.target.value})}/>
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
              Select up to 2 courses per quarter. Click checkout when ready.
              <br />
              If you would like to see this message again, click on instructions to the top right of the page.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>{this.setState({help: false})}} color="primary">
              Continue
            </Button>
          </DialogActions>
        </Dialog>

        <DragDropContext onDragEnd={this.onDragEnd}>
          <Grid container>
            <Grid item xs={12} s={6} md={6} lg={6} xl={6}>
              <div style = {{display: 'flex', flexFlow: 'column', height: '100%'}}>
                <div style = {{flex: '1 1 auto', display: 'flex'}}>
                  <Typography variant = 'h3' style={{marginLeft: 15}}>
                  1
                  </Typography>
                  <div style={{flex: '1 1 auto', marginLeft: 8, display: "flex", justifyContent: "space-between"}}>
                    {['1f','1w','1s'].map(columnId => {
                      const column = this.state.selected[columnId];
                      const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                      return <Column key={column.id} column={column} courses={courses} />;
                    })}
                  </div>
                </div>

                <div style = {{flex: '1 1 auto', display: 'flex'}}>
                  <Typography variant = 'h3' style={{marginLeft: 15}}>
                  2
                  </Typography>
                  <div style={{flex: '1 1 auto', marginLeft: 8, display: "flex", justifyContent: "space-between"}}>
                    {['2f','2w','2s'].map(columnId => {
                      const column = this.state.selected[columnId];
                      const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                      return <Column key={column.id} column={column} courses={courses} />;
                    })}
                  </div>
                </div>

                <div style = {{flex: '1 1 auto', display: 'flex'}}>
                  <Typography variant = 'h3' style={{marginLeft: 15}}>
                  3
                  </Typography>
                  <div style={{flex: '1 1 auto', marginLeft: 8, display: "flex", justifyContent: "space-between"}}>
                    {['3f','3w','3s'].map(columnId => {
                      const column = this.state.selected[columnId];
                      const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                      return <Column key={column.id} column={column} courses={courses} />;
                    })}
                  </div>
                </div>

                <div style = {{flex: '1 1 auto', display: 'flex'}}>
                  <Typography variant = 'h3' style={{marginLeft: 15}}>
                  4
                  </Typography>
                  <div style={{flex: '1 1 auto', marginLeft: 8, display: "flex", justifyContent: "space-between"}}>
                    {['4f','4w','4s'].map(columnId => {
                      const column = this.state.selected[columnId];
                      const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                      return <Column key={column.id} column={column} courses={courses} />;
                    })}
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} s={6} md={6} lg={6} xl={6}>
              <div style={{display: 'flex', flexFlow: 'row', position: 'relative', height: 'calc(100vh - 62px + 9px)'}}>
                <div style={{flex: '0 1 auto', height: '100%'}}>
                  <Pool key={'pool'} column={this.state.pool} courses={this.state.pool.courseIds.map(courseId => this.state.courses[courseId])} />
                </div>

                <div style={{flex: '1 1 auto', marginTop: 5, marginLeft: 16, marginRight: 15, overflow: 'auto'}}>
                  <Typography variant='h6' style={{marginBottom: 5}}>
                    Requirements
                  </Typography>
                  <Typography variant='body2' style={{whiteSpace: "pre-line"}}>
                    {this.state.requirement}
                  </Typography>
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
