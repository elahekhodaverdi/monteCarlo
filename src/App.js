import React, { useState, useMemo, useEffect } from "react";
import Latex from "react-latex-next";
import 'katex/dist/katex.min.css';
import { Button, Layout, Typography, Card, Space } from "antd";
import ReactMarkdown from "react-markdown";
import "./App.css";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const App = () => {
  const [points, setPoints] = useState([]);
  const [insideCircle, setInsideCircle] = useState(0);
  const [R, setR] = useState(window.innerWidth < 412 ? 240 : 360);  // Set initial R based on screen width
  const [buttonSize, setButtonSize] = useState(window.innerWidth < 412 ? "small" : "large");
  const radius = R / 2;

  useEffect(() => {
    const handleResize = () => {
      setR(window.innerWidth < 412 ? 240 : 360);
      setButtonSize(window.innerWidth < 412 ? "small" : "large");
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateRandomPoint = () => {
    const x = Math.random() * R;
    const y = Math.random() * R;
    return { x, y };
  };

  const isInsideCircle = (x, y) => {
    const dx = x - radius;
    const dy = y - radius;
    return dx * dx + dy * dy <= radius * radius;
  };

  const ShapeDisplay = ({ points }) => (
    <div className="shapes-container">
      <div className="square" style={{ width: `${R}px`, height: `${R}px` }}>
        <div className="circle" style={{ width: `${R}px`, height: `${R}px` }}></div>
        {points.map((point, index) => (
          <div
            key={index}
            className="point"
            style={{
              left: `${point.x - 2}px`,
              top: `${point.y - 2}px`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );

  const CalculationInfo = ({ insideCircle, totalPoints }) => {
    const insideRatio = totalPoints > 0 ? (insideCircle / totalPoints).toFixed(4) : 0;
    const approxPi = (insideRatio * 4).toFixed(4);

    return (
      <div>
        <ReactMarkdown>
          {`#### We can compute a neat ratio with that:`}
        </ReactMarkdown>
        <Latex>{`\\(\\frac{\\text{inside the circle}}{\\text{total points}} = \\frac{${insideCircle}}{${totalPoints}}\\)`}</Latex>
        <ReactMarkdown>
          {`**Square**`}
        </ReactMarkdown>
        <Latex>{`\\(\\text{Area} = (2r)^2 = (2)^2 \\times r^2 = 4 \\times r^2\\)`}</Latex>
        <ReactMarkdown>
          {`**Circle**`}
        </ReactMarkdown>
        <Latex>{`\\(\\text{Area} = \\pi \\times r^2\\)`}</Latex>
        <ReactMarkdown>
          {`**Approximation**`}
        </ReactMarkdown>
        <Latex>{`\\(\\frac{\\text{inside the circle}}{\\text{total points}} = \\frac{${insideCircle}}{${totalPoints}} \\approx \\frac{\\text{area of circle}}{\\text{area of square}}\\)`}</Latex>
        <br />
        <Latex>{`\\(\\frac{${insideCircle}}{${totalPoints}} \\approx \\frac{\\pi \\times r^2}{4 \\times r^2} \\approx \\frac{\\pi \\times \\cancel{r^2}}{4 \\times \\cancel{r^2}} \\approx \\frac{\\pi}{4}\\)`}</Latex>
        <Paragraph style={{ marginTop: "16px" }}>
          Nice! Our ratio is approximately one-fourth of <Latex>{`\\(\\pi\\)`}</Latex>: 
          <br />
          <Latex>{`\\(\\pi \\approx 4 \\times \\frac{${insideCircle}}{${totalPoints}} \\approx ${approxPi}\\)`}</Latex>
        </Paragraph>
      </div>
    );
  };

  const handleGeneratePoints = (numPoints) => {
    const newPoints = [];
    let newInsideCircle = 0;

    for (let i = 0; i < numPoints; i++) {
      const point = generateRandomPoint();
      newPoints.push(point);
      if (isInsideCircle(point.x, point.y)) {
        newInsideCircle++;
      }
    }

    setPoints((prevPoints) => [...prevPoints, ...newPoints]);
    setInsideCircle((prevInsideCircle) => prevInsideCircle + newInsideCircle);
  };

  const handleReset = () => {
    setPoints([]);
    setInsideCircle(0);
  };

  const totalPoints = useMemo(() => points.length, [points]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#1890ff", padding: "16px 20px" }}>
        <Title level={3} style={{ color: "#fff", margin: 0 }}>Monte Carlo Method</Title>
      </Header>
      <Content style={{ display: 'flex', padding: "32px" }}>
        <div className="container">
          <Card className="left-container">
            <ShapeDisplay points={points} />
            <Space style={{ marginTop: "20px" }}>
              <Button size={buttonSize} onClick={handleReset}>Reset</Button>
              <Button size={buttonSize} type="primary" onClick={() => handleGeneratePoints(10)}>{R === 360 ? "Add" : ""} 10 Points</Button>
              <Button size={buttonSize} type="primary" onClick={() => handleGeneratePoints(100)}>{R === 360 ? "Add" : ""} 100 Points</Button>
            </Space>
          </Card>

          <Card className="calculation" title="Calculation">
            <CalculationInfo insideCircle={insideCircle} totalPoints={totalPoints} />
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
