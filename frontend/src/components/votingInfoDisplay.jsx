const VotingInfoDisplay = ({ voterInfo }) => {
  return (
    <div>
      <h2>Your voting information!</h2>
      <p>Election: {voterInfo?.election.name}</p>
      <p>Election Day: {voterInfo?.election.electionDay}</p>
      <p>Election ID: {voterInfo?.election.id}</p>
    </div>
  );
};

export default VotingInfoDisplay;
