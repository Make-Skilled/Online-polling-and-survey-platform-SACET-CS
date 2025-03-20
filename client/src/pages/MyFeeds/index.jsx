import PollPageTemplate from "../../components/PollPageTemplate";

const MyPolls = () => {
    return (
        <PollPageTemplate apiRoute='poll/allPolls' />
    );
};

export default MyPolls;
