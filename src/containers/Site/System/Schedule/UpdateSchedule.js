import React from 'react';
import ScheduleForm from './ScheduleForm';
import scheduleStore from "../../../../stores/schedule/scheduleStore";

export default function UpdateSchedule() {
  scheduleStore.onChangeUpdateMode(true);
  return (
    <ScheduleForm/>
  )
}
