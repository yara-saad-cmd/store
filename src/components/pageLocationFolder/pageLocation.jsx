
import { IoMdArrowBack } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import "./pageLocation.css"



export default function PageLocation() {
  const location = useLocation();
  const currentPath = location.pathname;

  const steps = [
    { name: "عربة المشتريات", path: "/cart" },
    { name: "تفاصيل الطلب", path: "/order-details" },
    { name: "الدفع", path: "/payment" },
    { name: "تم الطلب", path: "/order-done" },
  ];

  const currentIndex = steps.findIndex((step) => step.path === currentPath);

  return (
    <div className="page-location">
          {steps.map((step, index) => {
  const isActive = currentPath === step.path;
  // الخطوات اللي بعد الحالية مقفولة، والرجوع لخطوة سابقة مسموح
  const isUpcoming = index > currentIndex;

  return (
    <span key={step.path} className="step-container">
      <div className={isActive ? "step-active" : ""}>
        {isUpcoming ? (
          <span className="step-label step-disabled" aria-disabled="true">
            {step.name}
          </span>
        ) : (
          <Link
            to={step.path}
            className={`step-label ${isActive ? "step-active" : ""}`}
          >
            {step.name}
          </Link>
        )}
      </div>

      {index < steps.length - 1 && (
        <span className="checkout-arrow">
          <IoMdArrowBack />
        </span>
      )}
    </span>
  );
})}
    </div>
  );
}
