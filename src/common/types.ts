export type User = {
  readonly email: string;
  readonly email_verified: boolean;
  readonly image?: string;
  readonly name?: string;
  readonly user_id: string;
  readonly sign_in_provider: string;
  readonly customerId?: string;
  readonly firebase?: { sign_in_provider: string };
  readonly profession?: string;
  readonly isAdmin?: boolean;
};
