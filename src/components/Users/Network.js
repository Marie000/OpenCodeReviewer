import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import {pinkA200, transparent} from 'material-ui/styles/colors';
import './users.css';

//Network Component will display friends.
//Contains Placeholders at the moment
export default class Network extends Component {
  render() {
    return(
        <div>
            <List>
              <ListItem
                primaryText="Friendy macFriendFace"
                leftIcon={<ActionGrade />}
                rightAvatar={<Avatar src="http://placehold.it/140x100" />}
              />
              <ListItem
                primaryText="Professor FriendyPants"
                leftIcon={<ActionGrade />}
                insetChildren={true}
                rightAvatar={<Avatar src="http://placehold.it/140x100" />}
              />
              <ListItem
                primaryText="Friendly MacDoogle"
                leftIcon={<ActionGrade />}
                insetChildren={true}
                rightAvatar={<Avatar src="http://placehold.it/140x100" />}
              />
              <ListItem
                primaryText="Sir Friendington Esquire"
                leftIcon={<ActionGrade />}
                insetChildren={true}
                rightAvatar={<Avatar src="http://placehold.it/140x100" />}
              />
            </List>
        </div>
        )
  }
}
