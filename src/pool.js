import React from 'react';
import {
  Typography,
} from '@material-ui/core';
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd'
import Course from './course'

const Container = styled.div`
  margin: 5px;
  width: 100%;
  height: 96%;
`;
const CourseList = styled.div`
  margin: 8px;
  height: 93%;
  overflow-y: auto;
  overflow-x: hidden;
  flex-flow: column;
`;


export default class Pool extends React.Component{
  render(){
    return (
      <Container>
        <Typography variant='h6' style={{marginLeft: 5}}>
          Courses
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
