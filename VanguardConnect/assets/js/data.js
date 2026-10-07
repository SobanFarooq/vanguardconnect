// Demo data. Saved into LocalStorage the first time the app runs.
const defaultUsers = [
  {
    id: 1,
    username: "captainahmed",
    password: "123",
    name: "Captain Ahmed",
    rank: "Captain",
    rankLevel: 5,
    branch: "Army",
    unit: "Alpha Unit",
    profilePicture: "user1.jpg",
    lastLogin: "2 hours ago",
    friends: [2, 3]
  },
  {
    id: 2,
    username: "generalkhan",
    password: "123",
    name: "General Khan",
    rank: "General",
    rankLevel: 8,
    branch: "Army",
    unit: "Command HQ",
    profilePicture: "user2.jpg",
    lastLogin: "1 hour ago",
    friends: [1]
  },
  {
    id: 3,
    username: "soldierali",
    password: "123",
    name: "Soldier Ali",
    rank: "Soldier",
    rankLevel: 1,
    branch: "Army",
    unit: "Alpha Unit",
    profilePicture: "user3.jpg",
    lastLogin: "Yesterday",
    friends: [1]
  }
];

// Put users in LocalStorage only if they are not there yet
function initData() {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }
}
initData();

const defaultPosts = [
  { id: 1, userId: 2, category: "Announcement", content: "Annual exercise begins Monday. All units report by 0600.", likes: 42, dislikes: 0, time: "1h" },
  { id: 2, userId: 1, category: "Achievement", content: "Completed advanced leadership training with Alpha Unit.", likes: 10, dislikes: 1, time: "3h" },
  { id: 3, userId: 3, category: "Moments", content: "Sunrise over the training grounds. Good start to the week.", likes: 6, dislikes: 0, time: "5h" }
];
if (!localStorage.getItem("posts")) localStorage.setItem("posts", JSON.stringify(defaultPosts));
