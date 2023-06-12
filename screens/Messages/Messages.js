import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import ShadowView from '../extensions/ShadowView';
import MessageItem from '../items/MessageItem';
import {connect} from 'react-redux';

function mapStateToProps(state) {
  return {
    user: state.userReducer,
  };
}

function Messages({user}) {
  const opened = useSharedValue(true);
  const [selected, setSelected] = useState(0);

  return (
    <ShadowView opened={opened} disabled={true}>
      {user.notification?.messages.map(
        (message, i) =>
          selected === i && (
            <MessageItem
              message={message}
              opened={opened}
              setSelected={setSelected}
              index={i}
              key={i}
            />
          ),
      )}
    </ShadowView>
  );
}

const styles = StyleSheet.create({});

export default connect(mapStateToProps, null)(Messages);
