using System;
using System.Collections.Generic;
using Niftified.Entities;

namespace Niftified.Models.Tags
{
	public class TokenIconResponse
	{
		public string DataSourceFileType { get; set; }
		public string DataSourceFileName { get; set; }
		public long DataSourceFileSize { get; set; }
		public bool ApprovalRequested { get; set; }
	}
}