class Solution(object):
  def two_sum(self, nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
nums = [1,2,3,4,6]
solution = Solution()
print(solution.two_sum(nums, 9))