import React, { Component, Fragment } from 'react';
import {
  Button,
  Grid,
  Toolbar,
  AppBar,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Divider,
} from '@material-ui/core';
import {
  DragDropContext,
} from 'react-beautiful-dnd';
import Column from './column';
import Pool from './pool';

const COURSES = {
  'bio-1': {id: 'bio-1', content: 'bio-1', tag: [1]},
  'bio-2': {id: 'bio-2', content: 'bio-2', tag: [1]},
  'bio-3': {id: 'bio-3', content: 'bio-3', tag: [1]},
  'bio-4': {id: 'bio-4', content: 'bio-4', tag: [1]},
  'bio-5': {id: 'bio-5', content: 'bio-5', tag: [1]},
  'bio-6': {id: 'bio-6', content: 'bio-6', tag: [1]},
  'bio-7': {id: 'bio-7', content: 'bio-7', tag: [1]},
  'bio-8': {id: 'bio-8', content: 'bio-8', tag: [1]},
  'bio-9': {id: 'bio-9', content: 'bio-9', tag: [1]},
  'bio-10': {id: 'bio-10', content: 'bio-10', tag: [1]},
  'bio-11': {id: 'bio-11', content: 'bio-11', tag: [1]},
  'bio-12': {id: 'bio-12', content: 'bio-12', tag: [1]},
  'bio-13': {id: 'bio-13', content: 'bio-13', tag: [1]},
  'bio-14': {id: 'bio-14', content: 'bio-14', tag: [1]},
  'bio-15': {id: 'bio-15', content: 'bio-15', tag: [1]},
  'bio-16': {id: 'bio-16', content: 'bio-16', tag: [1]},
  'bio-100': {id: 'bio-100', content: 'bio-100', tag: [3]},
  'bio-101': {id: 'bio-101', content: 'bio-101', tag: [3]},
  'bio-102': {id: 'bio-102', content: 'bio-102', tag: [3]},
  'bio-103': {id: 'bio-103', content: 'bio-103', tag: [3]},
  'bio-104': {id: 'bio-104', content: 'bio-104', tag: [3]},
  'bio-105': {id: 'bio-105', content: 'bio-105', tag: [3]},
  'bio-106': {id: 'bio-106', content: 'bio-106', tag: [3]},
  'capstone-1': {id: 'capstone-1', content: 'capstone-1', tag: [7]},
  'capstone-2': {id: 'capstone-2', content: 'capstone-2', tag: [7]},
}

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

const REQUIREMENT = `
Biology Difficulty 4 /4\n
Core Curriculum
Life Sciences: 3 and 27L
Chemistry: 12A and 12B
Mathematics: 6A, and 6C or 6D
Physics: 3A and 3B

Chemistry
Chemistry: 119A, 119B, 120, 125, or 130

Foundation Courses ��� Choose two courses from the following list:
Ecology & Evolutionary Biology: 113 or 114, 127, 198, 129
Physics: 111, 114A
Chemistry: one of 119B, 120, 121, 125, 130

Laboratory Courses -��� Choose five courses from the following list:
Ecology & Evolutionary Biology: 113A, 127, 129, 130, 132 + 132A (most take BOTH courses for it to count), 137, 151, 151A, 158, 160, 161, 174, 178, 185, 192, 193
Microbiology: 112, 112, 118, 121
Physiological Science: 112, 116, 119
At least two courses taken to fulfill this requirement must be Ecology & Evolutionary Biology: courses

Upper Division Electives ��� Choose eight courses from the following list:
Anthropology: 110 and/or one of 116A, 116P, or 119A
Ecology & Evolutionary Biology: 127, 129, 130, 146A, 151, 151A, 154, 158, 160, 161, 174, 178, 179, 193, 198 (can be taken multiple times, but only can be counted twice towards requirements)
Molecular Biology: 112, 114, 115, 124, 128, 131, 133, 142`

const min = (a,b) => {
  return (a>b) ? b : a;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: COURSES,
      selected: INIT_SELECTED,
      pool: {
        id: 'pool',
        title: 'Course Listing',
        courseIds: Object.keys(COURSES),
      },
      failed: [],
      checked: false,
      new: false,
      requirement: REQUIREMENT,
    };
  }

  checkout = () => {
    var SUMTAG = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    var year;
    var cid;
    var tag;
    for (year in this.state.selected){
      for (cid of this.state.selected[year]['courseIds']){
        for (tag of COURSES[cid]['tag']){
          SUMTAG[tag] += 1;
        }
      }
    }
    console.log(SUMTAG);
    var nfailed = [];
    if(!(SUMTAG[1] >= 16)){
      nfailed.push(1);
    }
    if(!(SUMTAG[3] >= 7)){
      nfailed.push(2);
    }
    if(!(SUMTAG[4] >= 7)){
      nfailed.push(3);
    }
    if(!(SUMTAG[4]+SUMTAG[5]+min(SUMTAG[6],3) >= 10)){
      nfailed.push(4);
    }
    if(!(SUMTAG[3]+SUMTAG[4]+SUMTAG[5]+min(SUMTAG[6],3)+min(SUMTAG[7],2) >= 23)){
      nfailed.push(5);
    }
    if(!(SUMTAG[8] >= 6)){
      nfailed.push(6);
    }
    if(!(SUMTAG[7] >= 2)){
      nfailed.push(7);
    }
    if(!(SUMTAG[9]+min(SUMTAG[11],3)+min(SUMTAG[12],2) >= 34)){
      nfailed.push(8);
    }
    if(!((SUMTAG[4] + SUMTAG[5] + min(SUMTAG[6],3))+(SUMTAG[7]) - SUMTAG[10] >= 10 + 2)){
      nfailed.push(9);
    }

    this.setState({failed: nfailed, checked: true});
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
      console.log(this.state)
    } else {
      return;
    }
  }

  render() {
    return (
      <Fragment>
        <AppBar
          position="static"
          style={{
            marginBottom: '4px',
            boxShadow: 'none',
            backgroundColor: '#305db7',
          }}
        >
          <Toolbar variant="dense">
            <div style={{ flexGrow: 1 }}>
              {'Major Requirements Complexity'}
            </div>

            <Typography variant = "body1" style={{margin: 5}}>
            Email
            </Typography>

            <Button onClick={this.checkout} variant="contained" color="secondary">
            checkout
            </Button>
          </Toolbar>
        </AppBar>

        <Dialog open={this.state.new} onClose={()=>{this.setState({new: false})}} style={{minWidth: "80%"}}>
          <DialogTitle>Welcome</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Thank you for participating in our study! Before we begin, please tell us about yourself!
              Your information is used strictly for the purposes of this survey and will not be released to other parties.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>{this.setState({new: false})}} color="primary">
              Continue
            </Button>
          </DialogActions>
        </Dialog>


        <DragDropContext onDragEnd={this.onDragEnd}>
          <Grid container>
            <Grid item xs={12} s={6} md={6} lg={6} xl={6}>
              <Typography variant = 'h6' style={{margin: 10}}>
              Select up to 2 courses per quarter. Click checkout when ready.
              </Typography>
              <Divider />
              <Typography variant = 'h7' style={{margin: 15}}>
              Year One
              </Typography>
              <div style={{marginLeft: 8, display: "flex", justifyContent: "space-between"}}>
                {['1f','1w','1s'].map(columnId => {
                  const column = this.state.selected[columnId];
                  const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                  return <Column key={column.id} column={column} courses={courses} />;
                })}
              </div>
              <Divider />
              <Typography variant = 'h7' style={{margin: 15}}>
              Year Two
              </Typography>
              <div style={{marginLeft: 8, display: "flex", justifyContent: "space-between"}}>
                {['2f','2w','2s'].map(columnId => {
                  const column = this.state.selected[columnId];
                  const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                  return <Column key={column.id} column={column} courses={courses} />;
                })}
              </div>
              <Divider />
              <Typography variant = 'h7' style={{margin: 15}}>
              Year Three
              </Typography>
              <div style={{marginLeft: 8, display: "flex", justifyContent: "space-between"}}>
                {['3f','3w','3s'].map(columnId => {
                  const column = this.state.selected[columnId];
                  const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                  return <Column key={column.id} column={column} courses={courses} />;
                })}
              </div>
              <Divider />
              <Typography variant = 'h7' style={{margin: 15}}>
              Year Four
              </Typography>
              <div style={{marginLeft: 8, display: "flex", justifyContent: "space-between"}}>
                {['4f','4w','4s'].map(columnId => {
                  const column = this.state.selected[columnId];
                  const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                  return <Column key={column.id} column={column} courses={courses} />;
                })}
              </div>
            </Grid>

            <Grid item xs={12} s={6} md={6} lg={6} xl={6}>
              <Paper style={{height: '100%', width: '97%'}}>
                <Typography variant='body1' style={{margin: 10}}>
                `{this.state.requirement}`
                </Typography>

                <Pool key={'pool'} column={this.state.pool} courses={this.state.pool.courseIds.map(courseId => this.state.courses[courseId])} />

                {(this.state.checked) ? (
                  (this.state.failed !== []) ? (
                    <Fragment>
                      <Typography style={{margin: '10px'}}>
                      Failed the following requirements:
                      </Typography>
                      <ul>
                      {this.state.failed.map((item) => {
                        return (<Typography><li>{item}</li></Typography>);
                      })}
                      </ul>
                    </Fragment>
                  ) : (
                    <Typography>
                    All requirements met
                    </Typography>
                  )
                ) : (
                  <Fragment />
                )}
              </Paper>
            </Grid>
          </Grid>
        </DragDropContext>
      </Fragment>
    );
  }
}

export default App;
