import React, {Fragment} from 'react';
import styled from 'styled-components';
import {Droppable} from 'react-beautiful-dnd'
import Course from './course'

const Container = styled.div`
  margin: 5px;
  border: 1px solid lightgrey;
  width: 100%;
  height: 95%;
  background-color: #ededed;
`;
const CourseList = styled.div`
  min-height: 115px;
  display: flex;
  justify-content: space-between;
  height: 100%;
`;
const DashedDivider = styled.div`
  z-index: 100;
  top: 0;
  bottom: 0;
  width: 3;
  border-right: 1px dashed #D3D3D3;
`;
const LeftSpacer = styled.div`
  width: 50%;
  z-index: 100;
  top: 0;
  bottom: 0;
  border-right: 1px dashed #D3D3D3;
`;
const RightSpacer = styled.div`
  width: 100%;
  z-index: 100;
  top: 0;
  bottom: 0;
  border-left: 1px dashed #D3D3D3;
`;

export default class Column extends React.Component{
  render(){
    return (
      <Container>
        <Droppable droppableId={this.props.column.id} direction="horizontal">
          {(provided) => (
            <CourseList
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
            {(this.props.courses.length === 0) ?
            (
              <LeftSpacer />
            ) : (
              (this.props.courses.length === 1) ?
              (
                <Fragment>
                  <Course index={0} key={this.props.courses[0].id} course={this.props.courses[0]} parentId={this.props.column.id} delete={this.props.delete}/>
                  <RightSpacer />
                </Fragment>
              ) : (
                <Fragment>
                  <Course index={0} key={this.props.courses[0].id} course={this.props.courses[0]} parentId={this.props.column.id} delete={this.props.delete}/>
                  <DashedDivider />
                  <Course index={1} key={this.props.courses[1].id} course={this.props.courses[1]} parentId={this.props.column.id} delete={this.props.delete}/>
                </Fragment>
              )
            )}
            </CourseList>
          )}
        </Droppable>
      </Container>
    )
  }
}
