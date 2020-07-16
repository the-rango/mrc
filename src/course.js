import React, {Fragment} from 'react';
import {IconButton, Typography} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import styled from 'styled-components';
import {Draggable} from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 3px;
  margin: 3px;
  width: 69px;
  display: flex;
  min-height: 56px;
  overflow-y: auto;
  overflow-x: hidden;
  flex-flow: column;
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
              <Typography variant="body2" style={{flexGrow: 1}}>
                {this.props.course.content}
              </Typography>
              {(this.props.delete ?
              (
                <div style={{ display: "flex", flexFlow: "row"}}>
                  <div style={{flexGrow: 1}} />
                  <IconButton style={{flexGrow: 0}} size="small" variant="text" onClick={()=>this.props.delete(this.props.parentId, this.props.index, this.props.course.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ):(
                <Fragment />
              ))}
            </Container>
          </Fragment>
        )}
      </Draggable>
    )
  }
}
