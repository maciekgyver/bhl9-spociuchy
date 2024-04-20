import { Input } from "../components/Input";
import { Select, SelectOption } from "../components/Select";
import { useForm } from "react-hook-form";
import { NewEventData } from "../types/event.types";

const GROUP_OPTIONS: SelectOption[] = [
  {
    label: "group 1",
    value: "group_1",
  },
  {
    label: "group 2",
    value: "group_2",
  },
  {
    label: "group 3",
    value: "group_3",
  },
  {
    label: "whole company",
    value: "comp",
  },
];

const TIME_OPTIONS: SelectOption[] = [
  {
    label: "10 minutes",
    value: "10m",
  },
  {
    label: "20 minutes",
    value: "20m",
  },
  {
    label: "30 minutes",
    value: "30m",
  },
];

export const NewEventPage = () => {
  const { register, handleSubmit } = useForm<NewEventData>();

  const onSubmit = (data: NewEventData) => {
    console.log(data);
  };
  return (
    <form
      className="flex flex-col w-full gap-y-2 items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p>new event</p>
      <Input {...register("question")} />
      <Select options={GROUP_OPTIONS} {...register("group")} />
      <Select options={TIME_OPTIONS} {...register("time")} />
      <button>Submit</button>
    </form>
  );
};
