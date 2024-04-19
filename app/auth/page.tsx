
import { Descope } from '@descope/nextjs-sdk';
const Page = () => {
	return (
        <div className="flex flex-col items-center p-24 rounded-md">
            <Descope
                flowId="sign-up-or-in"
                redirectAfterSuccess="/dashboard"
                // redirectAfterError="/error-page"
            />
        </div>
	);
};

export default Page;
