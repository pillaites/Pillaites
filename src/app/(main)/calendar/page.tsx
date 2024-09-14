"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Typography, Button, Paper } from "@mui/material";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const events = [
  {
    title: 'Meeting with Bob',
    start: new Date(),
    end: new Date(moment().add(1, 'hours').toDate()),
  },
  {
    title: 'Project Deadline',
    start: new Date(moment().add(3, 'days').toDate()),
    end: new Date(moment().add(3, 'days').add(1, 'hours').toDate()),
  },
];

const CalendarPage = () => {
  const { resolvedTheme } = useTheme();

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="p-4">
        <Typography variant="h4" gutterBottom>
          Calendar
        </Typography>
        <Paper elevation={3} className="p-4">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '80vh' }}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
          />
        </Paper>
      </div>
    </main>
  );
};

export default CalendarPage;
