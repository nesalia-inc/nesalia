export type AuthFlowResult = {
  accessToken: string;
  sessionToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
};