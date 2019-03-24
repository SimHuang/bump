import React from 'react';

export const EventContext = React.createContext({});

class GlobalContext extends React.Component {
  state = {
    currentEvents: {},
    selectedEvent: null,
    user: null,
    shouldUpdateSetting: false,
    filter: null
  }

  setCurrentEvents(currentEvents) {
    this.setState({currentEvents});
  }

  setSelectedEvent(selectedEvent, callback) {
    this.setState({selectedEvent}, () => {
      callback();
    });
  }

  setUser(user) {
    this.setState({user});
  }

  setFilter(value) {
    this.setState({value});
  }

  render() {
    return (
      <EventContext.Provider value={
        {
          ...this.state,
          setCurrentEvents: (events) => this.setCurrentEvents(events),
          setSelectedEvent: (event, callback) => this.setSelectedEvent(event, callback),
          setUser: (user) => this.setUser(user),
          setFilter: (filter) => this.setFilter(filter)
        }
      }>
        {this.props.children}
      </EventContext.Provider>
    )
  }
}

export default GlobalContext
