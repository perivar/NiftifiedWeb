using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Niftified.Hubs
{
	public class NiftySignalRHub : Hub
	{
		public async Task Broadcast(string user, string message)
		{
			await Clients
			   // Do not Broadcast to Caller:
			   .AllExcept(new[] { Context.ConnectionId })
			   // Broadcast to all connected clients:
			   .SendAsync("Broadcast", user, message);
		}

		public async Task BroadcastAll(string user, string message)
		{
			await Clients.All.SendAsync("Broadcast", user, message);
		}
	}
}
