# Server-Response Chart Challenge 
Web development projects

Given the definition of certain response (data structure is described in form of JSON schema, see response_definition.json) from server side,

1.	(Required) Implement mock server APIs based on the JSON schema. It should provide response randomly, i.e. each request should get different response. (Recommend to use jQuery-mockjax. But, as long as the implementation meets the API requirements, candidates can use other plugins/libraries that are more comfortable to them. This exception to toolset is only valid here.)
a.	GET: /server_stat/<serverID>?from=<starttime>&to=<endtime>
b.	POST: /server_stat

2.	(Required) Design and implement one chart component to visualize the time series fields of the response.
a.	The chart component should be configurable (title, marker’s color and axis labels).
b.	The chart component should support plotting one field or multiple fields by configuration through the UI.
c.	The chart component should be able to visualize the data in at least below forms:
i.	Line Chart
ii.	Bar Chart
Try to come up with other suitable visualization types, if you can.
d.	The chart component should be able to update the visualization in real-time with new response from server side. (live charts)

3.	(Optional) Design and implement one component that can generate proper form UI for users to submit data entry to server side.

4.	Show your working components in one page with the best look and feel that you can come up with.

5.	Create a simple instruction on how to run your work.
The toolset to use is limited:
	Javascript, CSS, HTML, jQuery, jQuery-mockjax, lodash, Bootstrap and D3.js

Please select one of below frameworks to implement your components:
•	Angular 1.x.x 
•	React 15.x.x
