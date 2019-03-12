import React from 'react';

export const EventContext = React.createContext({});

class GlobalContext extends React.Component {
  state = {
    currentEvents: {},
    selectedEvent: null
  }

  setCurrentEvents(currentEvents) {
    console.log('events stored');
    this.setState({currentEvents});
    console.log(this.state.currentEvents);
  }

  setSelectedEvent(selectedEvent, callback) {
    console.log('selected events from global context ' + selectedEvent);
    this.setState({selectedEvent}, () => {
      callback();
    });
  }

  render() {
    return (
      <EventContext.Provider value={
        {
          ...this.state,
          setCurrentEvents: (events) => this.setCurrentEvents(events),
          setSelectedEvent: (event, callback) => this.setSelectedEvent(event, callback)
        }
      }>
        {this.props.children}
      </EventContext.Provider>
    )
  }
}

export default GlobalContext
