import { Button } from "@/components/shared";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-[100vh] text-center">
      <h1 className="font-bold mb-4 text-[6rem]">404</h1>
      <p className="text-[2rem] mb-4">Oops! Page not found.</p>
      <p className="text-[1.5rem]">The requested page does not exist.</p>
      <Button className="mt-4" onClick={() => navigate(-1)}>
        Go back
      </Button>
    </div>
  );
};

export default NotFound;
