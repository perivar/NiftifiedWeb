using System;
using System.Collections.Generic;
using Niftified.Entities;

namespace Niftified.Models.Tags
{
	public class FileResponse
	{
		public string DataSourceFileType { get; set; }
		public string DataSourceFileName { get; set; }
		public long DataSourceFileSize { get; set; }
	}
}