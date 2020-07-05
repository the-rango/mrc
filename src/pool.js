import React from 'react';
import {
  Typography,
} from '@material-ui/core';
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd'
import Course from './course'

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 97%;
  min-height: 90px;
`;
const CourseList = styled.div`
  margin: 8px;
  display: flex;
  overflow: auto;
  justify-content: space-between;
`;


export default class Pool extends React.Component{
  render(){
    return (
      <Container>
        <Typography variant="h7" style={{margin: 10}}>{this.props.column.title}</Typography>
        <Droppable droppableId={this.props.column.id} direction="horizontal" isDropDisabled={true}>
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
