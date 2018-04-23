import React from 'react';
import ScheduleForm from './ScheduleForm';
import scheduleStore from "../../../../stores/schedule/scheduleStore";

export default function CreateSchedule() {
  scheduleStore.onChangeUpdateMode(false);
  return (
    <ScheduleForm/>
  )
}
