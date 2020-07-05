import React, {Fragment} from 'react';
import styled from 'styled-components';
import {Draggable} from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 3px;
  width: 80px;
  min-width: 80px;
  display: flex;
  min-height: 56px;
`;
// const Clone = styled(Container)`
//   + div {
//     display: none!important;
//   }
// `;
// https://codesandbox.io/s/40p81qy7v0?file=/index.js

export default class Course extends React.Component {
  render(){
    return (
      <Draggable draggableId={this.props.course.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Fragment>
            <Container
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
            >
              {this.props.course.content}
            </Container>
          </Fragment>
        )}
      </Draggable>
    )
  }
}
