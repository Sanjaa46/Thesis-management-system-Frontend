// src/components/GraphQLTest.js
import React, { useState, useEffect } from 'react';
import { executeGraphQLQuery } from '../graphql/client';

const GraphQLTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setLoading(true);
        
        // Simple introspection query
        const result = await executeGraphQLQuery(`
          {
            __schema {
              queryType {
                name
              }
            }
          }
        `);
        
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    testConnection();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">GraphQL Connection Test</h2>
      
      {loading && <p>Testing connection...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {!loading && !error && data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Success!</strong> Connected to GraphQL API.
          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
      
      <button 
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => window.location.reload()}
      >
        Test Again
      </button>
    </div>
  );
};

export default GraphQLTest;