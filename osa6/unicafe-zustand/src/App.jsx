import { useGood, useNeutral, useBad, useTotal, useAverage, usePositivePercent, useFeedbackActions } from './store';

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>;

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = () => {
  const good = useGood();
  const neutral = useNeutral();
  const bad = useBad();
  const total = useTotal();
  const average = useAverage();
  const positive = usePositivePercent();

  if (total === 0) return <p>No feedback given</p>;

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average.toFixed(1)} />
        <StatisticLine text="positive" value={`${positive.toFixed(1)} %`} />
      </tbody>
    </table>
  );
};

const App = () => {
  const { incrementGood, incrementNeutral, incrementBad } = useFeedbackActions();

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button handleClick={incrementGood} text="good" />
        <Button handleClick={incrementNeutral} text="neutral" />
        <Button handleClick={incrementBad} text="bad" />
      </div>
      <h1>statistics</h1>
      <Statistics />
    </div>
  );
};

export default App;