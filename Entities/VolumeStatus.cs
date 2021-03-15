using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public enum VolumeStatus
	{
		Pending, // not yet minted
		ForSale, // ready to be sold
		NotForSale // not set to be sold
	}
}