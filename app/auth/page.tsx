'use client'

import { Descope } from '@descope/nextjs-sdk';
const Page = () => {
	return (
        <div className="flex flex-col items-center p-24 rounded-md">
            <Descope
                flowId="sign-up-or-in"
                onSuccess={(e) => {
                    console.log('Logged in!')
                    window.location.href = "/"
                }}
                onError={(e) => console.log('Could not logged in!')}
                // redirectAfterSuccess="/"
                // redirectAfterError="/error-page"
            />
        </div>
	);
};

export default Page;