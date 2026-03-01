import { ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';
import parser from 'html-react-parser';
import { useGetTermConditionQuery } from '@/redux/features/termCondition/termConditionApi';
import usePageView from '@/utils/usePageView';

export default function TermsConditions() {
    usePageView("Terms and Conditions");
    window.scrollTo(0, 0);
    const { data } = useGetTermConditionQuery({});
    const termsCondition = useMemo(() => data?.data, [data]);

    return (
        <div className="min-h-screen py-20">
            <div className="container lg:w-2/3 mx-auto">

                {/* Header Section */}
                <div className="bg-primary p-8 text-center text-white rounded-t-2xl">
                    <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-90" />
                    <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">{termsCondition?.title}</h1>
                </div>

                <div>
                    {termsCondition?.content && parser(termsCondition.content)}
                </div>
            </div>
        </div>
    );
};
