import * as Linking from "expo-linking";
import { Platform } from "react-native";

import { supabase } from "@/lib/supabase";

type ApiUser = {
  user_id: string;
  email: string;
  display_name: string;
  role: string;
  auth_provider: string;
};

export type CurrentUserResponse = {
  user: ApiUser;
};

export type SubjectSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  topic_count: number;
};

export type TopicSummary = {
  id: string;
  subject_slug: string;
  slug: string;
  title: string;
  description: string;
  order_index: number;
  question_count: number;
};

export type QuestionOption = {
  id: string;
  label: string;
  text: string;
};

export type QuestionSummary = {
  id: string;
  topic_slug: string;
  question_type: string;
  difficulty: string;
  stem: string;
  explanation: string;
  hint_levels: string[];
  options: QuestionOption[];
  correct_option_ids: string[];
  tags: string[];
};

export type SubjectDetail = SubjectSummary & {
  topics: TopicSummary[];
};

export type TopicDetail = TopicSummary & {
  questions: QuestionSummary[];
};

function getInferredApiBaseUrl() {
  const runtimeUrl = Linking.createURL("/");
  const parsed = Linking.parse(runtimeUrl);
  const hostname = parsed.hostname;

  if (!hostname) {
    return null;
  }

  if (Platform.OS === "android" && hostname === "localhost") {
    return "http://10.0.2.2:8000/api/v1";
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://127.0.0.1:8000/api/v1";
  }

  return `http://${hostname}:8000/api/v1`;
}

const defaultApiBaseUrl =
  getInferredApiBaseUrl() ??
  Platform.select({
    android: "http://10.0.2.2:8000/api/v1",
    default: "http://127.0.0.1:8000/api/v1",
  });

export const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? defaultApiBaseUrl ?? "http://127.0.0.1:8000/api/v1";

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    "Content-Type": "application/json",
    ...(session?.access_token
      ? {
          Authorization: `Bearer ${session.access_token}`,
        }
      : {}),
  };
}

async function request<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      headers: await getAuthHeaders(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network request failed.";
    const mobileHint =
      Platform.OS === "web"
        ? ""
        : ` If you are testing on a physical device, run the API with --host 0.0.0.0 and ensure ${apiBaseUrl} is reachable from your phone.`;

    throw new Error(`${message}${mobileHint}`);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export function getCurrentUser() {
  return request<CurrentUserResponse>("/me");
}

export function getSubjects() {
  return request<SubjectSummary[]>("/subjects");
}

export function getSubject(subjectSlug: string) {
  return request<SubjectDetail>(`/subjects/${subjectSlug}`);
}

export function getTopic(topicSlug: string) {
  return request<TopicDetail>(`/topics/${topicSlug}`);
}
