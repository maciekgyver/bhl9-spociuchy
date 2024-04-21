import { Input } from "../components/Input";
import { Select, SelectOption } from "../components/Select";
import { useForm } from "react-hook-form";
import { NewEventData } from "../types/event.types";
import { getCurrentDateDelayed } from "../utils/getDate";
import { useCallback, useEffect, useState } from "react";
import { ServerUrls, getServerUrl } from "../config/serverUrls";
import { MainHeading, Paragraph, SubHeading } from "../components/Typography";
import { Spinner } from "../components/icons/Spinner";

type NewEventInputs = {
  question: string;
  group: number;
  delay: number;
};

type GroupType = {
  group_id: number;
  group_name: string;
};

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
  {
    label: "45 minutes",
    value: 45,
  },
  {
    label: "1 hour",
    value: 60,
  },
];

export const NewEventPage = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupsError, setGroupsError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewEventInputs>();

  const getGroups = useCallback(async () => {
    try {
      const response = await fetch(getServerUrl(ServerUrls.GET_GROUPS));
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      let groupsData = await response.json();
      setGroups(groupsData);
      setGroupsError(null);
    } catch (err: any) {
      setGroups([]);
      setGroupsError(err.message);
    } finally {
      setGroupsLoading(false);
    }
  }, []);

  const addNewActivity = useCallback(async (newEventData: NewEventData) => {
    setSubmitLoading(true);
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
      setSubmitError(null);
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
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

  useEffect(() => {
    getGroups();
  }, []);

  const { question: questionError } = errors;

  if (groupsLoading) {
    return <Spinner />;
  }

  if (groupsError) {
    return <SubHeading className="text-red-500">{groupsError}</SubHeading>;
  }

  if (submitSuccess) {
    return <SubHeading className="text-green-500">Success!</SubHeading>;
  }

  return (
    <div className="flex w-full h-full items-center flex-col gap-y-6 sm:gap-y-8 px-2">
      <MainHeading>Add a new event</MainHeading>
      <form
        className="flex flex-col flex-1 w-full gap-y-3 items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          error={questionError?.message}
          {...register("question", {
            required: "Question is required",
          })}
        />
        <Select
          options={groups.map((group) => ({
            label: group.group_name,
            value: group.group_id,
          }))}
          {...register("group", { required: true, valueAsNumber: true })}
        />
        <Select
          options={TIME_OPTIONS}
          {...register("delay", { required: true, valueAsNumber: true })}
        />
        {submitError && (
          <Paragraph className="text-red-500">{submitError}</Paragraph>
        )}
        <button
          className="w-full max-w-4xl flex justify-center"
          disabled={submitLoading}
        >
          {submitLoading ? <Spinner size="small" /> : "Submit"}
        </button>
      </form>
    </div>
  );
};
