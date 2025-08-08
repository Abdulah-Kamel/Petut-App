export const datePickerStyles = `
.react-datepicker {
  font-family: inherit;
  border: 2px solid #F97316 !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
  background-color: white;
}

.react-datepicker__header {
  background-color: #F97316 !important;
  border-bottom: none !important;
  border-radius: 12px 12px 0 0 !important;
  padding: 16px 12px !important;
}

.react-datepicker__current-month {
  color: white !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  margin-bottom: 8px !important;
}

.react-datepicker__day-name {
  color: white !important;
  font-weight: 500 !important;
  width: 2rem !important;
  line-height: 2rem !important;
}

.react-datepicker__navigation {
  top: 20px !important;
}

/* Hide navigation icons */
.react-datepicker__navigation-icon,
.react-datepicker__navigation-icon--next,
.react-datepicker__navigation-icon--previous {
  display: none !important;
}

.react-datepicker__navigation {
  display: none !important;
}

.react-datepicker__day {
  color: #374151 !important;
  border-radius: 8px !important;
  margin: 2px !important;
  width: 2rem !important;
  line-height: 2rem !important;
  transition: all 0.2s ease !important;
}

.react-datepicker__day:hover {
  background-color: #FFEDD5 !important;
  color: #F97316 !important;
}

.react-datepicker__day--selected {
  background-color: #F97316 !important;
  color: white !important;
  font-weight: 600 !important;
}

.react-datepicker__day--keyboard-selected {
  background-color: #FED7AA !important;
  color: #F97316 !important;
}

.react-datepicker__day--disabled {
  color: #D1D5DB !important;
  background-color: #F9FAFB !important;
  cursor: not-allowed !important;
}

.react-datepicker__time-container {
  border-left: 2px solid #E5E7EB !important;
  width: 100px !important;
}

.react-datepicker__time-container .react-datepicker__time {
  background: white !important;
  border-radius: 0 0 12px 0 !important;
}

.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
  width: 100px !important;
}

/* Time header styling - Make sure Time text is white */
.react-datepicker__time-container .react-datepicker__header,
.react-datepicker__time-header,
.react-datepicker__time-name,
.react-datepicker__time-container > div:first-child {
  color: white !important;
  background-color: #F97316 !important;
  padding: 12px !important;
  font-weight: 600 !important;
  text-align: center !important;
  border-radius: 0 12px 0 0 !important;
}

.react-datepicker__time-container .react-datepicker__header *,
.react-datepicker__time-header *,
.react-datepicker__time-name *,
.react-datepicker__time-container > div:first-child * {
  color: white !important;
}

/* Remove any flexbox or icon-related styles */
.react-datepicker__time-container .react-datepicker__header,
.react-datepicker__time-header {
  display: block !important;
}

/* Hide all icons in time header */
.react-datepicker__time-container .react-datepicker__header svg,
.react-datepicker__time-container .react-datepicker__header i,
.react-datepicker__time-header svg,
.react-datepicker__time-header i,
.react-datepicker__time-name svg,
.react-datepicker__time-name i,
.react-datepicker__time-container > div:first-child svg,
.react-datepicker__time-container > div:first-child i,
.dark .react-datepicker__time-container .react-datepicker__header svg,
.dark .react-datepicker__time-container .react-datepicker__header i,
.dark .react-datepicker__time-header svg,
.dark .react-datepicker__time-header i,
.dark .react-datepicker__time-name svg,
.dark .react-datepicker__time-name i,
.dark .react-datepicker__time-container > div:first-child svg,
.dark .react-datepicker__time-container > div:first-child i {
  display: none !important;
}

/* Show and style icons in time header - both light and dark mode */
.react-datepicker__time-container .react-datepicker__header svg,
.react-datepicker__time-container .react-datepicker__header i,
.react-datepicker__time-header svg,
.react-datepicker__time-header i,
.react-datepicker__time-name svg,
.react-datepicker__time-name i,
.react-datepicker__time-container > div:first-child svg,
.react-datepicker__time-container > div:first-child i,
.dark .react-datepicker__time-container .react-datepicker__header svg,
.dark .react-datepicker__time-container .react-datepicker__header i,
.dark .react-datepicker__time-header svg,
.dark .react-datepicker__time-header i,
.dark .react-datepicker__time-name svg,
.dark .react-datepicker__time-name i,
.dark .react-datepicker__time-container > div:first-child svg,
.dark .react-datepicker__time-container > div:first-child i {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: white !important;
  font-size: 18px !important;
  margin: 0 4px !important;
}

/* Remove any display: none rules */
.dark .react-datepicker__time-container .react-datepicker__header svg,
.dark .react-datepicker__time-container .react-datepicker__header i,
.dark .react-datepicker__time-header svg,
.dark .react-datepicker__time-header i,
.dark .react-datepicker__time-name svg,
.dark .react-datepicker__time-name i,
.dark .react-datepicker__time-container > div:first-child svg,
.dark .react-datepicker__time-container > div:first-child i {
  display: inline-flex !important;
}

/* Center all content in time header */
.react-datepicker__time-container .react-datepicker__header,
.react-datepicker__time-header,
.dark .react-datepicker__time-container .react-datepicker__header,
.dark .react-datepicker__time-header {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  padding: 12px !important;
  color: white !important;
  background-color: #F97316 !important;
}

/* Keep time list items with original colors */
.react-datepicker__time-list-item {
  color: #374151 !important;
  padding: 8px 12px !important;
  transition: all 0.2s ease !important;
}

/* Make sure disabled time slots can't be selected */
.react-datepicker__time-list-item--disabled {
  color: #D1D5DB !important;
  background-color: #F9FAFB !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}

.react-datepicker__time-list-item {
  padding: 8px 12px !important;
  transition: all 0.2s ease !important;
}

.react-datepicker__time-list-item:hover {
  background-color: #FFEDD5 !important;
  color: #F97316 !important;
}

.react-datepicker__time-list-item--selected {
  background-color: #F97316 !important;
  color: white !important;
  font-weight: 600 !important;
}

.react-datepicker__input-container input {
  width: 100% !important;
  padding: 12px 16px !important;
  border: 2px solid #E5E7EB !important;
  border-radius: 8px !important;
  font-size: 14px !important;
  transition: all 0.2s ease !important;
  background-color: white !important;
}

.react-datepicker__input-container input:focus {
  outline: none !important;
  border-color: #F97316 !important;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1) !important;
}

/* Dark mode styles */
.dark .react-datepicker {
  background-color: #1F2937 !important;
  border-color: #374151 !important;
  color: white !important;
}

.dark .react-datepicker__header {
  background-color: #F97316 !important;
}

.dark .react-datepicker__day {
  color: #F3F4F6 !important;
}

.dark .react-datepicker__day:hover {
  background-color: #FFEDD5 !important;
  color: #F97316 !important;
}

.dark .react-datepicker__day--selected {
  background-color: #F97316 !important;
  color: white !important;
}

.dark .react-datepicker__day--disabled {
  color: #6B7280 !important;
  background-color: #374151 !important;
}

.dark .react-datepicker__time-container .react-datepicker__time {
  background: #1F2937 !important;
}

.dark .react-datepicker__time-list-item:hover {
  background-color: #FFEDD5 !important;
  color: #F97316 !important;
}

.dark .react-datepicker__input-container input {
  background-color: #374151 !important;
  border-color: #4B5563 !important;
  color: white !important;
}

.dark .react-datepicker__input-container input:focus {
  border-color: #F97316 !important;
}

/* Dark mode time header - comprehensive */
.dark .react-datepicker__time-container .react-datepicker__header,
.dark .react-datepicker__time-header,
.dark .react-datepicker__time-name,
.dark .react-datepicker__time-container > div:first-child {
  color: white !important;
  background-color: #F97316 !important;
}

/* Hide icons in dark mode too */
.dark .react-datepicker__time-container .react-datepicker__header svg,
.dark .react-datepicker__time-container .react-datepicker__header i,
.dark .react-datepicker__time-header svg,
.dark .react-datepicker__time-header i,
.dark .react-datepicker__time-name svg,
.dark .react-datepicker__time-name i,
.dark .react-datepicker__time-container > div:first-child svg,
.dark .react-datepicker__time-container > div:first-child i {
  display: none !important;
}

/* Force white text in dark mode */
.dark .react-datepicker__time-container .react-datepicker__header *,
.dark .react-datepicker__time-header *,
.dark .react-datepicker__time-name *,
.dark .react-datepicker__time-container > div:first-child * {
  color: white !important;
}

/* Keep dark mode time list items with proper colors */
.dark .react-datepicker__time-list-item {
  color: #F3F4F6 !important;
  background-color: transparent !important;
}

/* Dark mode disabled time slots */
.dark .react-datepicker__time-list-item--disabled {
  color: #6B7280 !important;
  background-color: #374151 !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}
`;
