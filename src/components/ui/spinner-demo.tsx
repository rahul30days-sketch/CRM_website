import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

const SpinnerDemo = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <Spinner size={50} />
    </div>
  );
};

const SpinnerInverted = () => {
  return (
    <div className="bg-foreground flex w-full h-screen justify-center items-center">
      <Spinner size={50} invert />
    </div>
  );
};

const SpinnerWithButton = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
     <Button disabled>
				<Spinner invert className="me-2" /> Button With Spinner
			</Button>
    </div>
  );
};

export { SpinnerDemo, SpinnerInverted, SpinnerWithButton };
