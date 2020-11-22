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
              {this.props.courses.map((course, index) =><Course index={index} key={course.id} course={course}/>)}
              {provided.placeholder}
            </CourseList>
          )}
        </Droppable>
      </Container>
    )
  }
}
