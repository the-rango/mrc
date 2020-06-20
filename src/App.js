import React, { Component, Fragment } from 'react';
import {
  Button,
  Grid,
  Toolbar,
  AppBar,
  Typography,
  Paper,
} from '@material-ui/core';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';
import Column from './column';

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

const min = (a,b) => {
  return (a>b) ? b : a;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: COURSES,
      selected: {
        'y0': {
          id: 'y0',
          title: 'Year One',
          courseIds: [],
        },
        'y1': {
          id: 'y1',
          title: 'Year Two',
          courseIds: [],
        },
        'y2': {
          id: 'y2',
          title: 'Year Three',
          courseIds: [],
        },
        'y3': {
          id: 'y3',
          title: 'Year Four',
          courseIds: [],
        },
      },
      pool: {
        id: 'pool',
        title: 'Course Listing',
        courseIds: Object.keys(COURSES),
      },
      columnOrder: ['y0', 'y1', 'y2', 'y3'],
      failed: [],
      checked: false,
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
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (destination.droppableId !== 'pool'){
      const column = this.state.selected[destination.droppableId];
      const newCourseIds = Array.from(column.courseIds);
      newCourseIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...column,
        courseIds: newCourseIds,
      }

      const newState = {
        ...this.state,
        selected: {
          ...this.state.selected,
          [newColumn.id]: newColumn,
        },
      };

      this.setState(newState);
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

            <Button onClick={this.checkout} variant="contained" color="secondary">
            checkout
            </Button>
          </Toolbar>
        </AppBar>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Grid container>
            <Grid item xs={12} s={6} md={6} lg={6} xl={6}>
              {this.state.columnOrder.map(columnId => {
                const column = this.state.selected[columnId];
                const courses = column.courseIds.map(courseId => this.state.courses[courseId]);
                return <Column key={column.id} column={column} courses={courses} />;
              })}
            </Grid>

            <Grid item xs={12} s={6} md={6} lg={6} xl={6}>
              <Paper style={{height: '100%'}}>

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
                <Column key={'pool'} column={this.state.pool} courses={this.state.pool.courseIds.map(courseId => this.state.courses[courseId])} />
              </Paper>
            </Grid>
          </Grid>
        </DragDropContext>
      </Fragment>
    );
  }
}

export default App;
