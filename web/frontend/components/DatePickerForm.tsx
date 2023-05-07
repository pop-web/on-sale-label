import { HorizontalStack, Text, VerticalStack } from "@shopify/polaris";
import { Field } from "@shopify/react-form";
import { FC, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const DatePickerForm: FC<{
  startAt: Field<Date>;
  endAt: Field<Date>;
}> = ({ startAt, endAt }) => {
  const [startDate, setStartDate] = useState(
    startAt.value ? new Date(startAt.value) : null
  );
  const [endDate, setEndDate] = useState(
    endAt.value ? new Date(endAt.value) : null
  );

  return (
    <HorizontalStack gap="5">
      <VerticalStack gap="1">
        <Text as="h2" variant="headingSm">
          Start Date
        </Text>
        <DatePicker
          showPopperArrow={false}
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            startAt.onChange(date);
          }}
          timeInputLabel="Time:"
          dateFormat="yyyy/MM/dd HH:mm"
          showTimeInput
        />
      </VerticalStack>
      <VerticalStack gap="1">
        <Text as="h2" variant="headingSm">
          End Date
        </Text>
        <DatePicker
          showPopperArrow={false}
          selected={endDate}
          onChange={(date) => {
            setEndDate(date);
            endAt.onChange(date);
          }}
          timeInputLabel="Time:"
          dateFormat="yyyy/MM/dd HH:mm"
          showTimeInput
        />
      </VerticalStack>
    </HorizontalStack>
  );
};
