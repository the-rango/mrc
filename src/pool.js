import React from 'react';
import {
  Typography,
} from '@material-ui/core';
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd'
import Course from './course'

const Container = styled.div`
  margin: 5px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 97%;
  height: 100%;
`;
const CourseList = styled.div`
  margin: 8px;
  height: 100%;
  overflow: auto;
  flex-flow: column;
`;


export default class Pool extends React.Component{
  render(){
    return (
      <Container>
        <Typography variant="subtitle1" style={{marginLeft: 10}}>{this.props.column.title}</Typography>
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
