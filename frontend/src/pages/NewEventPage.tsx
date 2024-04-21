import { Input } from "../components/Input";
import { Select, SelectOption } from "../components/Select";
import { useForm } from "react-hook-form";
import { NewEventData } from "../types/event.types";
import { getCurrentDateDelayed } from "../utils/getDate";
import { useCallback, useState } from "react";
import { ServerUrls, getServerUrl } from "../config/serverUrls";

type NewEventInputs = {
  question: string;
  group: number;
  delay: number;
};

const GROUP_OPTIONS: SelectOption[] = [
  {
    label: "group 1",
    value: 1,
  },
  {
    label: "group 2",
    value: 2,
  },
  {
    label: "group 3",
    value: 3,
  },
  {
    label: "whole company",
    value: 4,
  },
];

const TIME_OPTIONS: SelectOption[] = [
  {
    label: "10 minutes",
    value: 10,
  },
  {
    label: "20 minutes",
    value: 20,
  },
  {
    label: "30 minutes",
    value: 30,
  },
];

export const NewEventPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewEventInputs>();

  const addNewActivity = useCallback(async (newEventData: NewEventData) => {
    setLoading(true);
    try {
      const response = await fetch(getServerUrl(ServerUrls.ADD_ACTIVITY), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEventData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      setError(null);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit = async (data: NewEventInputs) => {
    const newEventData: NewEventData = {
      question: data.question,
      group_id: data.group,
      created_at: Date.now(),
      expires_at: getCurrentDateDelayed(data.delay),
    };
    await addNewActivity(newEventData);
  };

  const { question: questionError } = errors;

  if (success) {
    return <p className="text-green-500">Success!</p>;
  }

  return (
    <form
      className="flex flex-col w-full gap-y-2 items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p>new event</p>
      <Input
        error={questionError?.message}
        {...register("question", {
          required: "Question is required",
        })}
      />
      <Select
        options={GROUP_OPTIONS}
        {...register("group", { required: true, valueAsNumber: true })}
      />
      <Select
        options={TIME_OPTIONS}
        {...register("delay", { required: true, valueAsNumber: true })}
      />
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
      <button disabled={loading}>Submit</button>
    </form>
  );
};
