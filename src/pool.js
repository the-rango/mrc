import React from 'react';
import {
  Typography,
} from '@material-ui/core';
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd'
import Course from './course'

const Container = styled.div`
  margin-right: 10px;
  margin-left: 8px;
  margin-bottom: 5px;
  margin-top: 5px;
  width: 170px;
  height: 92%;
`;
const CourseList = styled.div`
  margin-bottom: 5px;
  padding-right: 10px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  flex-flow: column;
`;


export default class Pool extends React.Component{
  render(){
    const clist = [...this.props.courses].sort((a,b)=>{
      const r = /\d+/;
      let anum = a.id.match(r);
      let bnum = b.id.match(r);
      const adept = a.id.substr(0, a.id.indexOf(anum));
      const bdept = b.id.substr(0, b.id.indexOf(bnum));
      anum = parseInt(anum);
      bnum = parseInt(bnum);
      if (adept > bdept){
        return 1;
      } else if (adept < bdept){
        return -1;
      } else if (anum > bnum){
        return 1;
      } else if (anum < bnum){
        return -1;
      } else {
        return (a.id.slice(-1) > b.id.slice(-1)) ? 1 : -1;
      }
    });
    return (
      <Container>
        <Typography variant='body1' style={{marginLeft: 5, textAlign: "center"}}>
          <strong>Courses</strong>
        </Typography>
        <Droppable droppableId={this.props.column.id} isDropDisabled={true}>
          {(provided, snapshot) => (
            <CourseList
              ref={provided.innerRef}
              {...provided.droppableProps}
              {...snapshot}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {clist.map((course, index) =><Course index={index} key={course.id} course={course}/>)}
              {provided.placeholder}
            </CourseList>
          )}
        </Droppable>
      </Container>
    )
  }
}
