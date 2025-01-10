import { UserMyPage } from "./components/user-mypage";

const MyPage = () => {
  const Type = ["User", "Admin"];

  return (
    <div className="bg-slate-200">{Type[0] === "User" && <UserMyPage />}</div>
  );
};
export default MyPage;
