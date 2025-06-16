import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      console.log('Fetching analytics...');
      const response = await axios.get('http://127.0.0.1:8000/api/dashboard/');
      console.log('Analytics data:', response.data);
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading FlowPay Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        color: '#d32f2f'
      }}>
        <h2>Connection Error</h2>
        <p>Cannot connect to FlowPay API</p>
        <p style={{fontSize: '14px'}}>Make sure Django server is running at http://127.0.0.1:8000</p>
        <button 
          onClick={fetchAnalytics}
          style={{
            padding: '10px 20px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return <div>No data available</div>;
  }

  return (
    <div style={{
      padding: '20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        color: 'white',
        marginBottom: '40px',
        padding: '30px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          margin: '0 0 10px 0',
          fontWeight: '700'
        }}>
          FlowPay Business Dashboard
        </h1>
        <p style={{fontSize: '1.1rem', margin: '0', opacity: '0.9'}}>
          Real-time Transaction Analytics & Business Insights
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          borderLeft: '5px solid #4CAF50'
        }}>
          <h3 style={{
            fontSize: '1rem',
            color: '#666',
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Total Revenue
          </h3>
          <p style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            color: '#333',
            margin: '0 0 5px 0'
          }}>
            ${analytics.summary.total_revenue.toFixed(2)}
          </p>
          <p style={{fontSize: '0.9rem', color: '#888', margin: '0'}}>
            {analytics.summary.total_payments} transactions
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          borderLeft: '5px solid #FF9800'
        }}>
          <h3 style={{
            fontSize: '1rem',
            color: '#666',
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Processing Fees
          </h3>
          <p style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            color: '#333',
            margin: '0 0 5px 0'
          }}>
            ${analytics.summary.total_fees.toFixed(2)}
          </p>
          <p style={{fontSize: '0.9rem', color: '#888', margin: '0'}}>
            {analytics.summary.total_revenue > 0 ? 
              ((analytics.summary.total_fees / analytics.summary.total_revenue) * 100).toFixed(1) : 0
            }% of revenue
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          borderLeft: '5px solid #2196F3'
        }}>
          <h3 style={{
            fontSize: '1rem',
            color: '#666',
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Net Revenue
          </h3>
          <p style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            color: '#333',
            margin: '0 0 5px 0'
          }}>
            ${analytics.summary.total_net.toFixed(2)}
          </p>
          <p style={{fontSize: '0.9rem', color: '#888', margin: '0'}}>
            After processing fees
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          borderLeft: '5px solid #9C27B0'
        }}>
          <h3 style={{
            fontSize: '1rem',
            color: '#666',
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Average Transaction
          </h3>
          <p style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            color: '#333',
            margin: '0 0 5px 0'
          }}>
            ${analytics.summary.average_payment.toFixed(2)}
          </p>
          <p style={{fontSize: '0.9rem', color: '#888', margin: '0'}}>
            Per transaction
          </p>
        </div>
      </div>

      {/* Data Sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        marginBottom: '40px'
      }}>
        {/* Payment Methods */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            margin: '0 0 20px 0',
            color: '#333',
            fontWeight: '600'
          }}>
            Payment Methods Performance
          </h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {analytics.payment_methods.map((method, index) => (
              <div key={index} style={{
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '10px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <strong style={{color: '#2196F3', fontSize: '1.1rem'}}>
                    {method.method__name}
                  </strong>
                  <span style={{
                    background: '#4CAF50',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {method.count} transactions
                  </span>
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#4CAF50'
                }}>
                  ${method.total_amount.toFixed(2)}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#666',
                  marginTop: '4px'
                }}>
                  Fees: ${method.total_fees ? method.total_fees.toFixed(2) : '0.00'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cashiers */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            margin: '0 0 20px 0',
            color: '#333',
            fontWeight: '600'
          }}>
            Top Performing Cashiers
          </h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {analytics.top_cashiers.map((cashier, index) => (
              <div key={index} style={{
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '10px',
                border: '1px solid #e9ecef',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  background: '#2196F3',
                  color: 'white',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}>
                  #{index + 1}
                </div>
                <div style={{flex: 1}}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '1.1rem',
                    marginBottom: '4px'
                  }}>
                    {cashier.user__username}
                  </div>
                  <div style={{
                    color: '#4CAF50',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}>
                    ${cashier.total_sales.toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#666'
                  }}>
                    {cashier.payment_count} transactions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        color: 'white',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{margin: '5px 0', opacity: '0.8'}}>
          Data from {analytics.date_range.start} to {analytics.date_range.end}
        </p>
        <p style={{margin: '5px 0', opacity: '0.8'}}>
          FlowPay Business Intelligence System
        </p>
      </div>
    </div>
  );
}

export default App;