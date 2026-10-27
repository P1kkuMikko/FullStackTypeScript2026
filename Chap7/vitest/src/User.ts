type User = {
  id: number;
  userName: string;
  fullName: string;
};
export const allUsers: User[] = [];

export function newUser(
  id: number,
  userName: string,
  fullName: string
): User {
  const user = {
    id,
    userName,
    fullName,
  };
  allUsers.push(user);
  return user;
}

export function getUser(id: number) {
  return allUsers.find((usr) => usr.id === id);
}

export function getLatestId() {
  if (allUsers.length === 0) {
    return 1;
  }
  return Math.max(...allUsers.map((usr) => usr.id)) + 1;
}

