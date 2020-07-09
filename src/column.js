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
  width: 100%;
  height: 83%;
`;
const CourseList = styled.div`
  min-height: 82px;
  display: flex;
  justify-content: space-between;
  height: 80%;
`;


export default class Column extends React.Component{
  render(){
    return (
      <Container>
        <Typography variant="subtitle2" style = {{margin: 3}}>{this.props.column.title}</Typography>
        <Droppable droppableId={this.props.column.id} direction="horizontal">
          {(provided) => (
            <CourseList
              ref={provided.innerRef}
              {...provided.droppableProps}
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
