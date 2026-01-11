import { createSubjects } from '@openauthjs/openauth/subject';
import { UserModel } from '@structa/core/user/';

export const subjects = createSubjects({
	user: UserModel.Subject,
});

export type Subjects = typeof subjects;
