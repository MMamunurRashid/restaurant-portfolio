import { useGetPrivacyPolicyQuery } from '@/redux/features/privacyPolicy/privacyPolicyApi';
import { ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';
import parser from 'html-react-parser';
import usePageView from '@/utils/usePageView';

export default function PrivacyPolicy() {
    usePageView("Privacy Policy");
    const { data } = useGetPrivacyPolicyQuery({});
    const policyData = useMemo(() => data?.data, [data]);

    return (
        <div className="min-h-screen py-20">
            <div className="container lg:w-2/3 mx-auto">

                {/* Header Section */}
                <div className="bg-indigo-600 p-8 text-center text-white rounded-t-2xl">
                    <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-90" />
                    <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">{policyData?.title}</h1>
                </div>

                <div>
                    {policyData?.content && parser(policyData.content)}
                </div>
            </div>
        </div>
    );
};
